import { Controller, Get } from '@nestjs/common';
import { TechnologiesService } from './services/technologies.service';
import { Technology } from './dao/technology.entity';

@Controller('technologies')
export class TechnologiesController {
	constructor(private readonly technologiesService: TechnologiesService) {}

	@Get()
	get(): Promise<Technology[]> {
		return this.technologiesService.getList();
	}
}
