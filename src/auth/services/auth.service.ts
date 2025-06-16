import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { RefreshTokensDto } from '../dto/RefreshTokensDto';
import { getAccessSignOptions, getRefreshSignOptions } from '../../consts/jwt-consts';
import { GameJwtPayload } from '../strategies/jwt.strategy';
import { ValidateUserDto } from '../dto/ValidateUserDto';
import { User } from 'src/users/dao/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
	) {}
	async login(data: ValidateUserDto) {
		const user = await this.validateUser({ username: data.username, password: data.password });
		if (!user) {
			throw new UnauthorizedException();
		}
		const payload = { username: user.username, sub: user.id };
		const accessToken = this.jwtService.sign(payload, getAccessSignOptions());
		const refreshToken = this.jwtService.sign({}, getRefreshSignOptions());
		return {
			access_token: accessToken,
			refresh_token: refreshToken,
		};
	}

	async refresh(data: RefreshTokensDto) {
		try {
			const payload = this.jwtService.verify<GameJwtPayload>(data.accessToken, {
				secret: process.env.JWT_ACCESS_SECRET,
				ignoreExpiration: true,
			});

			this.jwtService.verify(data.refreshToken, {
				secret: process.env.JWT_REFRESH_SECRET,
			});

            delete payload.exp;
            delete payload.iat;

			const [newAccessToken, newRefreshToken] = await Promise.all([
				this.jwtService.signAsync(payload, getAccessSignOptions()),
				this.jwtService.signAsync({}, getRefreshSignOptions()),
			]);

			return {
				access_token: newAccessToken,
				refresh_token: newRefreshToken,
			};
		}
        catch(_e) {
			throw new UnauthorizedException('Invalid tokens');
		}
	}

	private async validateUser(data: ValidateUserDto): Promise<Omit<User, 'password'>> {
		const user = await this.usersService.get({ email: data.email, username: data.username });
		const isMatch = bcrypt.compareSync(data.password, user.password);
		if (user && isMatch) {
			delete user.password;
			return user;
		}
		return null;
	}
}
