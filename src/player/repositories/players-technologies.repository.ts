import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PlayersTechnologies } from '../dao/player-technology.entity';

export type PlayersTechnologiesFilter = {
	playerId: number;
	technologyId?: number;
	level?: number;
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
				technology: true,
			},
		});
	}

	public getList(filter: PlayersTechnologiesFilter): Promise<PlayersTechnologies[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
				technology: true,
			},
		});
	}

	public save(data: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.repository.save({
			player: {
				id: data.playerId,
			},
			technology: {
				id: data.technologyId,
			},
		});
	}

	private toWhereOptions(filter: PlayersTechnologiesFilter): FindOptionsWhere<PlayersTechnologies> {
		return {
			player: {
				id: filter?.playerId,
			},
			technology: {
				id: filter?.technologyId,
				level: filter?.level,
			},
		};
	}
}
