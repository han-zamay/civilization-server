import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../dao/user.entity';

@Injectable()
export class UsersRepository {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
	) {}

	public getById(id: number): Promise<User> {
		return this.repository.findOne({
			where: {
				id,
			},
		});
	}

	public save(data: Partial<User>): Promise<User> {
		return this.repository.save(data);
	}
}
