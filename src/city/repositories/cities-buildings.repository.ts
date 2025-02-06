import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { CitiesBuildings } from '../dao/city-building.entity';

export type CitiesBuildingsFilter = {
	cityId: number;
	buildingId?: number;
};

@Injectable()
export class CitiesBuildingsRepository {
	constructor(
		@InjectRepository(CitiesBuildings)
		private readonly repository: Repository<CitiesBuildings>,
	) {}

	public get(filter: CitiesBuildingsFilter): Promise<CitiesBuildings> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
			relations: {
				city: true,
				building: true,
			},
		});
	}

	public getList(filter: CitiesBuildingsFilter): Promise<CitiesBuildings[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
			relations: {
				city: true,
				building: true,
			},
		});
	}

	public save(data: CitiesBuildingsFilter): Promise<CitiesBuildings> {
		return this.repository.save({
			city: {
				id: data.cityId,
			},
			building: {
				id: data.buildingId,
			},
		});
	}

	public delete(id: number): Promise<DeleteResult> {
		return this.repository.delete(id);
	}

	private toWhereOptions(filter: CitiesBuildingsFilter): FindOptionsWhere<CitiesBuildings> {
		return {
			city: {
				id: filter?.cityId,
			},
			building: {
				id: filter?.buildingId,
			},
		};
	}
}
