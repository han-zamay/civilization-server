import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../dao/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUserDto } from '../dto/ValidateUserDto';
import { JwtService } from '@nestjs/jwt';

export class AuthResponse {
    access_token: string;
    refresh_token: string;
    user: Omit<User, 'password'>;
  }

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService) {}

	public get(id: number): Promise<User> {
		return this.usersRepository.get({ id });
	}

	public async validateUser(data: ValidateUserDto): Promise<Omit<User, 'password'>> {
        console.log(data);
        const user = await this.usersRepository.get({ email: data.email, username: data.username });
        console.log(user, data.password, user.password);
        const isMatch = bcrypt.compareSync(data.password, user.password);
        if (user && isMatch) {
			const { password, ...result } = user;
            return result;
        }
        return null;
    }

	public async save(data: Partial<User>): Promise<AuthResponse> {
		const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = await this.usersRepository.save({ ...data, password: hashedPassword });

        const payload = { username: newUser.username, sub: newUser.id };

        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: '15m',
          });
        
          const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
          });
        
          return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
              id: newUser.id,
              username: newUser.username,
              email: newUser.email,
            },
          };
	}
}
