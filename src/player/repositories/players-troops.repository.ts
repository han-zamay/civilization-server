import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { PlayersTroops } from '../dao/player-troop.entity';
import { TroopsType } from 'src/enums/troops-type';

export type PlayersTroopsFilter = {
	id?: number;
	troopId?: number;
	playerId?: number;
	troopsType?: TroopsType;
};

@Injectable()
export class PlayersTroopsRepository {
	constructor(
		@InjectRepository(PlayersTroops)
		private readonly repository: Repository<PlayersTroops>,
	) {}

	public get(filter: PlayersTroopsFilter): Promise<PlayersTroops> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
				troop: true,
			},
		});
	}

	public getList(filter: PlayersTroopsFilter): Promise<PlayersTroops[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
				troop: true,
			},
		});
	}

	public save(data: PlayersTroopsFilter): Promise<PlayersTroops> {
		return this.repository.save({
			player: {
				id: data.playerId,
			},
			troop: {
				id: data.troopId,
			},
		});
	}

	public delete(id: number): Promise<DeleteResult> {
		return this.repository.delete(id);
	}

	private toWhereOptions(filter: PlayersTroopsFilter): FindOptionsWhere<PlayersTroops> {
		return {
			id: filter?.id,
			player: {
				id: filter?.playerId,
			},
			troop: {
				id: filter?.troopId,
				type: filter?.troopsType,
			},
		};
	}
}
