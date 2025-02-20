import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../dao/game.entity';

@Injectable()
export class GamesRepository {
	constructor(
		@InjectRepository(Game)
		private readonly repository: Repository<Game>,
	) {}

	public get(id: number): Promise<Game> {
		return this.repository.findOne({
			where: {
				id,
			},
			relations: {
				players: true,
			}
		});
	}

	public save(data: Partial<Game>): Promise<Game> {
		return this.repository.save({
			id: data.id,
			turn: data.turn,
			fase: data.fase,
			activePlayerIndex: data.activePlayerIndex,
			playersCount: data.playersCount,
		});
	}
}
