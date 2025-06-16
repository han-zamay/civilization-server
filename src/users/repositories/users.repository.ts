import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../dao/user.entity';

export type UserFilter = {
	id?: number;
	username?: string;
	email?: string;
};

@Injectable()
export class UsersRepository {
	constructor(
		@InjectRepository(User)
		private readonly repository: Repository<User>,
	) {}

	public get(filter: UserFilter): Promise<User> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter: UserFilter): Promise<User[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

	public save(data: Partial<User>): Promise<User> {
		return this.repository.save(data);
	}

	private toWhereOptions(filter?: UserFilter): FindOptionsWhere<User> {
		return {
			id: filter?.id,
			email: filter?.email,
			username: filter?.username,
		};
	}
}
