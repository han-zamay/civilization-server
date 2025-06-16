import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Loot } from '../dao/loot.entity';
import { Resource } from 'src/enums/resource';

export type LootFilter = {
	id?: number;
	isVillage?: boolean;
	resource?: Resource;
	isImmediately?: boolean;
};

@Injectable()
export class LootRepository {
	constructor(
		@InjectRepository(Loot)
		private readonly repository: Repository<Loot>,
	) {}

	public get(filter?: LootFilter): Promise<Loot> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter?: LootFilter): Promise<Loot[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

	// public save(data: LootFilter): Promise<Loot> {
	//     return this.repository.save({
	//         id: data?.id,
	//         isVillage: data?.isVillage,
	//         resource: data?.resource,
	//         isImmediately: data?.isImmediately,
	//     })
	// }

	private toWhereOptions(filter?: LootFilter): FindOptionsWhere<Loot> {
		return {
			id: filter?.id,
			isVillage: filter?.isVillage,
			resource: filter?.resource,
			isImmediately: filter?.isImmediately,
		};
	}
}
