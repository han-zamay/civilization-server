import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Battle } from '../dao/battle.entity';

export type BattleFilter = {
	id?: number;
	attackPlayerId?: number;
	defensePlayerId?: number;
    isAttackTurn?: boolean;
	trophies?: number;
	winnerId?: number;
	loserId?: number;
};

@Injectable()
export class BattleRepository {
	constructor(
		@InjectRepository(Battle)
		private readonly repository: Repository<Battle>,
	) {}

	public get(filter: BattleFilter): Promise<Battle> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				attackPlayer: true,
				defensePlayer: true,
			}
		});
	}

	public getList(filter: BattleFilter): Promise<Battle[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				attackPlayer: true,
				defensePlayer: true,
			}
		});
	}

	public save(filter: BattleFilter): Promise<Battle> {
		return this.repository.save({
			id: filter?.id,
			attackPlayer: {
				id: filter?.attackPlayerId,
			},
			defensePlayer: {
				id: filter?.defensePlayerId,
			},
            isAttackTurn: filter?.isAttackTurn,
			trophies: filter?.trophies,
			winnerId: filter?.winnerId,
			loserId: filter?.loserId,
		})
	}

	private toWhereOptions(filter?: BattleFilter): FindOptionsWhere<Battle> {
		return {
			id: filter?.id,
			attackPlayer: {
				id: filter?.attackPlayerId,
			},
			defensePlayer: {
				id: filter?.defensePlayerId,
			},
            isAttackTurn: filter?.isAttackTurn,
		};
	}
}
