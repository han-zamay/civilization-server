import { Injectable } from '@nestjs/common';
import { TileTemplateRepository } from '../repositories/tile-template.repository';
import { TileTemplate } from '../dao/tile-template.entity';
import { CellFilter, CellRepository } from '../repositories/cell.repository';
import { Cell } from '../dao/cell.entity';
import { CellTemplateFilter, CellTemplateRepository } from '../repositories/cell-template.repository';
import { getMatrix } from 'src/utils/getEmptyArray';
import { CellTemplate } from '../dao/cell-template.entity';

@Injectable()
export class MapService {
	constructor(
		private readonly tileTemplateRepository: TileTemplateRepository,
		private readonly cellRepository: CellRepository,
		private readonly cellTemplateRepository: CellTemplateRepository,
	) {}

	public async createTile(isNationTile: boolean): Promise<TileTemplate> {
		const cells = await this.cellTemplateRepository.getList();
		const tile = getMatrix(4, 4);
		let randomId: number;
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				randomId = Math.floor(Math.random() * (isNationTile ? 5 : 6));
				tile[i][j] = cells[randomId].id;
			}
		}
		return this.tileTemplateRepository.save({ cells: tile, isNationTile });
	}

	public getTile(id: number): Promise<TileTemplate> {
		return this.tileTemplateRepository.get(id);
	}

	public async getTiles(amount: number): Promise<TileTemplate[]> {
		const tiles = await this.tileTemplateRepository.getList(false);
		tiles.sort(() => Math.floor(Math.random() * 3 - 1));
		return tiles.slice(0, amount);
	}

	public getCellTemplate(filter: CellTemplateFilter): Promise<CellTemplate> {
		return this.cellTemplateRepository.get(filter);
	}

	public getCell(filter: CellFilter): Promise<Cell> {
		return this.cellRepository.get(filter);
	}

	public getCells(filter: CellFilter): Promise<Cell[]> {
		return this.cellRepository.getList(filter);
	}

	public saveCell(filter: CellFilter): Promise<Cell> {
		return this.cellRepository.save(filter);
	}
}
