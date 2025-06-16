import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CellTemplate } from '../dao/cell-template.entity';
import { Relict } from 'src/enums/relict';

export type CellTemplateFilter = {
	id?: number;
	hut?: boolean;
	village?: boolean;
	relict?: Relict;
};

@Injectable()
export class CellTemplateRepository {
	constructor(
		@InjectRepository(CellTemplate)
		private readonly repository: Repository<CellTemplate>,
	) {}

	public get(filter?: CellTemplateFilter): Promise<CellTemplate> {
		return this.repository.findOne({
			where: this.toWhereOptions(filter),
		});
	}

	public getList(filter?: CellTemplateFilter): Promise<CellTemplate[]> {
		return this.repository.find({
			where: this.toWhereOptions(filter),
		});
	}

	private toWhereOptions(filter?: CellTemplateFilter): FindOptionsWhere<CellTemplate> {
		return {
			id: filter?.id,
			hutMarker: filter?.hut,
			villageMarker: filter?.village,
			relict: filter?.relict,
		};
	}
}
