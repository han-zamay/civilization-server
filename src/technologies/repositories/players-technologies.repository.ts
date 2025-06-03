import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PlayersTechnologies } from '../dao/player-technology.entity';
import { Technology } from 'src/enums/technology';

export type PlayersTechnologiesFilter = {
	id?: number;
	playerId?: number;
	technology?: Technology;
	coinsOnTechnology?: number;
};

@Injectable()
export class PlayersTechnologiesRepository {
	constructor(
		@InjectRepository(PlayersTechnologies)
		private readonly repository: Repository<PlayersTechnologies>,
	) {}

	public get(filter: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
			},
		});
	}

	public getList(filter: PlayersTechnologiesFilter): Promise<PlayersTechnologies[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
			},
		});
	}

	public save(data: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.repository.save({
			id: data.id,
			player: {
				id: data.playerId,
			},
			technology: data.technology,
			coinsOnTechnology: data.coinsOnTechnology,
		});
	}

	private toWhereOptions(filter: PlayersTechnologiesFilter): FindOptionsWhere<PlayersTechnologies> {
		return {
			id: filter?.id,
			player: {
				id: filter?.playerId,
			},
			technology: filter?.technology,
		};
	}
}
