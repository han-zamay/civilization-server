import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TileTemplate } from '../dao/tile-template.entity';

@Injectable()
export class TileTemplateRepository {
	constructor(
		@InjectRepository(TileTemplate)
		private readonly repository: Repository<TileTemplate>,
	) {}

	public get(id: number): Promise<TileTemplate> {
		return this.repository.findOne({
			where: {
                id,
            },
		});
	}

	public getList(isNationTile: boolean): Promise<TileTemplate[]> {
		return this.repository.find({
			where: {
                isNationTile,
            },
		});
	}

	public save(data: Partial<TileTemplate>): Promise<TileTemplate> {
		return this.repository.save(data);
	}
}