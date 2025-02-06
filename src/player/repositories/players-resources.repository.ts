import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { PlayersResources } from '../dao/player-resource.entity';
import { Resource } from '../../enums/resource';

export type PlayersResourcesFilter = {
	playerId: number;
	resourceType?: Resource;
	isOpen?: boolean;
};

@Injectable()
export class PlayersResourcesRepository {
	constructor(
		@InjectRepository(PlayersResources)
		private readonly repository: Repository<PlayersResources>,
	) {}

	public get(filter: PlayersResourcesFilter): Promise<PlayersResources> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
			},
		});
	}

	public getList(filter: PlayersResourcesFilter): Promise<PlayersResources[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
			},
		});
	}

	public save(data: PlayersResourcesFilter): Promise<PlayersResources> {
		return this.repository.save({
			player: {
				id: data.playerId,
			},
			resourceType: data.resourceType,
			isOpen: data.isOpen,
		});
	}

	public delete(id: number): Promise<DeleteResult> {
		return this.repository.delete(id);
	}

	private toWhereOptions(filter: PlayersResourcesFilter): FindOptionsWhere<PlayersResources> {
		return {
			player: {
				id: filter?.playerId,
			},
			resourceType: filter?.resourceType,
			isOpen: filter?.isOpen,
		};
	}
}
