import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { PlayersFigure } from '../dao/player-figure.entity';

export type PlayersFiguresFilter = {
	id?: number;
	playerId?: number;
	cellId?: number;
	isArmy?: boolean;
    onField?: boolean;
    x?: number;
    y?: number;
	marchPoints?: number;
};

@Injectable()
export class PlayersFiguresRepository {
	constructor(
		@InjectRepository(PlayersFigure)
		private readonly repository: Repository<PlayersFigure>,
	) {}

	public get(filter: PlayersFiguresFilter): Promise<PlayersFigure> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				player: {
					game: true,
				},
				cell: true,
			},
		});
	}

	public getList(filter: PlayersFiguresFilter): Promise<PlayersFigure[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: {
					game: true,
				},
				cell: true,
			},
		});
	}

	public save(data: PlayersFiguresFilter): Promise<PlayersFigure> {
		return this.repository.save({
			id: data?.id,
			player: data?.playerId ? {
				id: data.playerId,
			} : undefined,
			cell: data?.cellId ? {
				id: data.cellId,
			} : undefined,
			isArmy: data?.isArmy,
            onField: data?.onField,
            x: data?.x,
            y: data?.y,
			marchPoints: data?.marchPoints,
		});
	}

	// public delete(id: number): Promise<DeleteResult> {
	// 	return this.repository.delete(id);
	// }

	private toWhereOptions(filter: PlayersFiguresFilter): FindOptionsWhere<PlayersFigure> {
		return {
			id: filter?.id,
			player: {
				id: filter?.playerId,
			},
			cell: {
				id: filter?.cellId,
			},
			isArmy: filter?.isArmy,
            x: filter?.x,
            y: filter?.y,
		};
	}
}