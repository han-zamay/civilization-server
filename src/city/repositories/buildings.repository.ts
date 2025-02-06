import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '../dao/building.entity';

@Injectable()
export class BuildingsRepository {
	constructor(
		@InjectRepository(Building)
		private readonly repository: Repository<Building>,
	) {}

	public get(id: number): Promise<Building> {
		return this.repository.findOne({
			where: {
				id,
			},
		});
	}
}
