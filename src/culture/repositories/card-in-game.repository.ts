import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CardInGame } from '../dao/card-in-game.entity';
import { CultureCard } from 'src/enums/cultureCard';

export type CardInGameFilter = {
	id?: number;
	name?: CultureCard;
    gameId?: number;
	playerId?: number;
    isUsed?: boolean;
};

@Injectable()
export class CardInGameRepository {
	constructor(
		@InjectRepository(CardInGame)
		private readonly repository: Repository<CardInGame>,
	) {}

	public get(filter: CardInGameFilter): Promise<CardInGame> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
                game: true,
				player: true,
			},
		});
	}

	public getList(filter: CardInGameFilter): Promise<CardInGame[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
                game: true,
				player: true,
			},
		});
	}

	public save(data: CardInGameFilter): Promise<CardInGame> {
		return this.repository.save({
			id: data?.id,
			name: data?.name,
            game: {
                id: data?.gameId
            },
			player: {
				id: data?.playerId,
			},
			isUsed: data?.isUsed,
		});
	}

	public saveMany(data: CardInGameFilter[]): Promise<CardInGame[]> {
		return this.repository.save(data.map((card) => ({
			id: card?.id,
			name: card?.name,
            game: {
                id: card?.gameId
            },
			player: {
				id: card?.playerId,
			},
			isUsed: card?.isUsed,
		})));
	}

	private toWhereOptions(filter: CardInGameFilter): FindOptionsWhere<CardInGame> {
		return {
			id: filter?.id,
			name: filter?.name,
            game: {
                id: filter?.gameId
            },
			player: {
				id: filter?.playerId,
			},
			isUsed: filter?.isUsed,
		};
	}
}
