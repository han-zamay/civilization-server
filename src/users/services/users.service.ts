import { Injectable } from '@nestjs/common';
import { UserFilter, UsersRepository } from '../repositories/users.repository';
import { User } from '../dao/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { getAccessSignOptions, getRefreshSignOptions } from 'src/consts/jwt-consts';

export class AuthResponse {
	access_token: string;
	refresh_token: string;
	user: Omit<User, 'password'>;
}

@Injectable()
export class UsersService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly jwtService: JwtService,
	) {}

	public get(data: UserFilter): Promise<User> {
		return this.usersRepository.get(data);
	}

	public async save(data: Partial<User>): Promise<AuthResponse> {
		const hashedPassword = await bcrypt.hash(data.password, 10);
		const newUser = await this.usersRepository.save({ ...data, password: hashedPassword });

		const payload = { username: newUser.username, sub: newUser.id };

		const accessToken = this.jwtService.sign(payload, getAccessSignOptions());

		const refreshToken = this.jwtService.sign(payload, getRefreshSignOptions());

		const { password: _password, ...user } = newUser;

		return {
			access_token: accessToken,
			refresh_token: refreshToken,
			user,
		};
	}
}
