import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../dao/user.entity';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	public get(id: number): Promise<User> {
		return this.usersRepository.getById(id);
	}

	public save(data: Partial<User>): Promise<User> {
		return this.usersRepository.save(data);
	}
}
