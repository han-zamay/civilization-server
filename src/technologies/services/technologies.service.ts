import { Injectable } from '@nestjs/common';
import { TechnologiesRepository, TechologiesFilter } from '../repositories/technologies.repository';
import { Technology } from '../dao/technology.entity';

@Injectable()
export class TechnologiesService {
	constructor(private readonly technologiesRepository: TechnologiesRepository) {}

	public get(filter?: TechologiesFilter): Promise<Technology> {
		return this.technologiesRepository.get(filter);
	}

	public getList(filter?: TechologiesFilter): Promise<Technology[]> {
		return this.technologiesRepository.getList(filter);
	}
}
