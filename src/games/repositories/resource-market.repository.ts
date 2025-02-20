import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/enums/resource';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ResourceMarket } from '../dao/resource-market';

export type ResourceMarketFilter = {
	id?: number;
    gameId?: number;
    resource?: Resource;
    amount?: number;
};

@Injectable()
export class ResourceMarketRepository {
	constructor(
		@InjectRepository(ResourceMarket)
		private readonly repository: Repository<ResourceMarket>,
	) {}

	public get(filter: ResourceMarketFilter): Promise<ResourceMarket> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter: ResourceMarketFilter): Promise<ResourceMarket[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

    public save(data: ResourceMarketFilter): Promise<ResourceMarket> {
        return this.repository.save({
            id: data?.id,
			game: {
                id: data?.gameId,
            },
            resource: data?.resource,
            amount: data?.amount,
        })
    }

	private toWhereOptions(filter?: ResourceMarketFilter): FindOptionsWhere<ResourceMarket> {
		return {
			id: filter?.id,
			game: {
                id: filter?.gameId,
            },
            resource: filter?.resource,
            amount: filter?.amount,
		};
	}
}