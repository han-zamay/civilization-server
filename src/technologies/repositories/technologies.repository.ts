import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Technology } from '../dao/technology.entity';

export type TechologiesFilter = {
	id?: number;
	level?: number;
};

@Injectable()
export class TechnologiesRepository {
	constructor(
		@InjectRepository(Technology)
		private readonly repository: Repository<Technology>,
	) {}

	public get(filter?: TechologiesFilter): Promise<Technology> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter?: TechologiesFilter): Promise<Technology[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

	public save(data: Partial<Technology>): Promise<Technology> {
		return this.repository.save(data);
	}

	private toWhereOptions(filter?: TechologiesFilter): FindOptionsWhere<Technology> {
		return {
			id: filter?.id,
			level: filter?.level,
		};
	}
}
