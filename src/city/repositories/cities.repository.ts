import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { City } from '../dao/city.entity';

export type CitiesFilter = {
	id?: number;
	playerId?: number;
};

@Injectable()
export class CitiesRepository {
	constructor(
		@InjectRepository(City)
		private readonly repository: Repository<City>,
	) {}

	public get(filter: CitiesFilter): Promise<City> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				player: {
					game: true,
				},
			},
		});
	}

	public getList(filter: CitiesFilter): Promise<City[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				player: true,
			},
		});
	}

	public save(data: Partial<City>): Promise<City> {
		return this.repository.save({
			id: data.id,
			isCapital: data.isCapital,
			x: data.x,
			y: data.y,
			hammers: data.hammers,
			tradePoints: data.tradePoints,
			culturePoints: data.culturePoints,
			advantage: data.advantage,
			possibleResources: data.possibleResources,
			action: data.action,
			havingSpecialBuilding: data.havingSpecialBuilding,
			havingWonder: data.havingWonder,
			player: data.player,
			defense: data.defense,
			havingWalls: data.havingWalls,
		});
	}

	public delete(id: number): Promise<DeleteResult> {
		return this.repository.delete(id);
	}

	private toWhereOptions(filter: CitiesFilter): FindOptionsWhere<City> {
		return {
			id: filter?.id,
			player: {
				id: filter?.playerId,
			},
		};
	}
}
