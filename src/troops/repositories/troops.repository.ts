import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Troop } from '../dao/troop.entity';
import { TroopsType } from 'src/enums/troops-type';

export type TroopsFilter = {
	id?: number;
	type?: TroopsType;
};

@Injectable()
export class TroopsRepository {
	constructor(
		@InjectRepository(Troop)
		private readonly repository: Repository<Troop>,
	) {}

	public get(filter: TroopsFilter): Promise<Troop> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter: TroopsFilter): Promise<Troop[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

	private toWhereOptions(filter?: TroopsFilter): FindOptionsWhere<Troop> {
		return {
			id: filter?.id,
			type: filter?.type,
		};
	}
}
