import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Player } from '../dao/player.entity';
import { Resource } from '../../enums/resource';

export type PlayerFilter = {
	id?: number;
	gameId?: number;
	userId?: number;
	playersOrder?: number;
	coins?: number;
	tradePoints?: number;
	resources?: Resource[];
};

@Injectable()
export class PlayersRepository {
	constructor(
		@InjectRepository(Player)
		private readonly repository: Repository<Player>,
	) {}

	public getList(filter: PlayerFilter): Promise<Player[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				game: true,
				user: true,
			},
		});
	}

	public get(filter: PlayerFilter): Promise<Player> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				game: true,
				user: true,
			},
		});
	}

	public save(data: PlayerFilter): Promise<Player> {
		return this.repository.save({
			id: data.id,
			game: {
				id: data.gameId,
			},
			user: {
				id: data.userId,
			},
			playersOrder: data.playersOrder,
			coins: data.coins,
			tradePoints: data.tradePoints,
			resources: data.resources,
		});
	}
	private toWhereOptions(filter: PlayerFilter): FindOptionsWhere<Player> {
		return {
			id: filter?.id,
			game: {
				id: filter?.gameId,
			},
			user: {
				id: filter?.userId,
			},
			playersOrder: filter?.playersOrder,
			coins: filter?.coins,
			tradePoints: filter?.tradePoints,
		};
	}
}
