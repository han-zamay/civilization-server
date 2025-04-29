import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Cell } from '../dao/cell.entity';
import { Relict } from 'src/enums/relict';

export type CellFilter = {
    id?: number;
	cellId?: number;
	cityId?: number;
    playerId?: number;
    gameId?: number;
    lootId?: number;
    armyCount?: number;
    scoutCount?: number;
    relict?: Relict;
    x?: number;
    y?: number;
};

@Injectable()
export class CellRepository {
	constructor(
		@InjectRepository(Cell)
		private readonly repository: Repository<Cell>,
	) {}

	public get(filter: CellFilter): Promise<Cell> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
            relations: {
                cell: true,
                player: true,
                city: true,
                loot: true,
                game: true,
            }
		});
	}

    public getList(filter?: CellFilter): Promise<Cell[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
            relations: {
                cell: true,
                player: true,
                city: true,
                loot: true,
                game: true,
            }
		});
	}

    public save(data: CellFilter): Promise<Cell> {
        return this.repository.save({
            id: data?.id,
            cell: data?.cellId ? {
                id: data?.cellId,
            } : undefined,
			city: data?.cityId ? {
                id: data.cityId,
            } : undefined,
			player: data?.playerId ? {
				id: data.playerId,
			} : undefined,
            loot: data?.lootId ? {
				id: data.lootId,
			} : undefined,
            game: data?.gameId ? {
				id: data.gameId,
			} : undefined,
            armyCount: data?.armyCount,
            scoutCount: data?.scoutCount,
            relict: data?.relict,
            x: data?.x,
            y: data?.y,
        })
    }

    private toWhereOptions(filter?: CellFilter): FindOptionsWhere<Cell> {
		return {
			id: filter?.id,
            cell: {
                id: filter?.cellId,
            },
			city: {
                id: filter?.cityId,
            },
			player: {
                id: filter?.playerId,
            },
            loot: {
                id: filter?.lootId,
            },
            game: {
                id: filter?.gameId,
            },
            x: filter?.x,
            y: filter?.y,
		};
	}
}