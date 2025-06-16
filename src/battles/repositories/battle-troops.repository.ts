import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BattleTroops } from '../dao/battle-troops.entity';
import { TroopsType } from 'src/enums/troops-type';

export type BattleTroopsFilter = {
	id?: number;
	troopId?: number;
	placement?: number;
	troopType?: TroopsType;
	health?: number;
	attack?: number;
	damage?: number;
	playerId?: number;
	battleId?: number;
};

@Injectable()
export class BattleTroopsRepository {
	constructor(
		@InjectRepository(BattleTroops)
		private readonly repository: Repository<BattleTroops>,
	) {}

	public get(filter: BattleTroopsFilter): Promise<BattleTroops> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
				battle: true,
			},
		});
	}

	public getList(filter: BattleTroopsFilter): Promise<BattleTroops[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
				battle: true,
			},
		});
	}

	public save(filter: BattleTroopsFilter): Promise<BattleTroops> {
		return this.repository.save({
			id: filter?.id,
			troopId: filter?.troopId,
			troopType: filter?.troopType,
			health: filter?.health,
			attack: filter?.attack,
			placement: filter?.placement,
			damage: filter?.damage,
			player: {
				id: filter?.playerId,
			},
			battle: {
				id: filter?.battleId,
			},
		});
	}

	private toWhereOptions(filter?: BattleTroopsFilter): FindOptionsWhere<BattleTroops> {
		return {
			id: filter?.id,
			troopId: filter?.troopId,
			placement: filter?.placement,
			damage: filter?.damage,
			player: {
				id: filter?.playerId,
			},
			battle: {
				id: filter?.battleId,
			},
		};
	}
}
