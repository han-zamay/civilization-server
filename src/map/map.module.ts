import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cell } from './dao/cell.entity';
import { CellTemplate } from './dao/cell-template.entity';
import { TileTemplate } from './dao/tile-template.entity';
import { MapService } from './services/map.service';
import { CellRepository } from './repositories/cell.repository';
import { CellTemplateRepository } from './repositories/cell-template.repository';
import { TileTemplateRepository } from './repositories/tile-template.repository';
import { MapController } from './map.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Cell, CellTemplate, TileTemplate])],
	controllers: [MapController],
	exports: [MapService],
	providers: [MapService, CellRepository, CellTemplateRepository, TileTemplateRepository],
})
export class MapModule {}
