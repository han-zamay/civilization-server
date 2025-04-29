import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Nation } from '../dao/nation.entity';

export type NationFilter = {
	id?: number;
	name?: string;
};

@Injectable()
export class NationsRepository {
	constructor(
		@InjectRepository(Nation)
		private readonly repository: Repository<Nation>,
	) {}

	public get(filter: NationFilter): Promise<Nation> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

    public getList(filter?: NationFilter): Promise<Nation[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

    private toWhereOptions(filter?: NationFilter): FindOptionsWhere<Nation> {
		return {
			id: filter?.id,
			name: filter?.name,
		};
	}
}