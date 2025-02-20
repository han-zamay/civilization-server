import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BuildingMarket } from '../dao/building-market';

export type BuildingMarketFilter = {
	id?: number;
    gameId?: number;
    buildingId?: number;
    amount?: number;
};

@Injectable()
export class BuildingMarketRepository {
	constructor(
		@InjectRepository(BuildingMarket)
		private readonly repository: Repository<BuildingMarket>,
	) {}

	public get(filter: BuildingMarketFilter): Promise<BuildingMarket> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter: BuildingMarketFilter): Promise<BuildingMarket[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

    public save(data: BuildingMarketFilter): Promise<BuildingMarket> {
        return this.repository.save({
            id: data?.id,
			game: {
                id: data?.gameId,
            },
            building: {
                id: data?.buildingId,
            },
            amount: data?.amount,
        })
    }

	private toWhereOptions(filter?: BuildingMarketFilter): FindOptionsWhere<BuildingMarket> {
		return {
			id: filter?.id,
			game: {
                id: filter?.gameId,
            },
            building: {
                id: filter?.buildingId,
            },
            amount: filter?.amount,
		};
	}
}