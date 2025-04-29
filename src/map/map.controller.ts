import { Body, Controller, Post } from '@nestjs/common';
import { MapService } from './services/map.service';
import { TileTemplate } from './dao/tile-template.entity';
import { CreateTileDto } from './dto/CreateTileDto';

@Controller('map')
export class MapController {
	constructor(private readonly mapService: MapService) {}

    @Post()
	makeTurn(@Body() body: CreateTileDto): Promise<TileTemplate> {
		return this.mapService.createTile(body.isNationTile);
	}
}