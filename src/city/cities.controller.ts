import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CitiesService } from './services/cities.service';
import { CitiesBuildings } from './dao/city-building.entity';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { GainResourceDto } from './dto/gain-resource.dto';
import { GainTroopDto } from './dto/gain-troop.dto';
import { PlayersTroops } from 'src/player/dao/player-troop.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { City } from './dao/city.entity';

@Controller('cities')
export class CitiesController {
	constructor(private readonly citiesService: CitiesService) {}

	@Post(':id')
	createCity(@Param('id', new ParseIntPipe()) id: number): Promise<City> {
		return this.citiesService.createCity(id);
	}

	@Post(':id/create-building')
	createBuilding(@Param('id', new ParseIntPipe()) id: number, @Body() body: CreateBuildingDto): Promise<CitiesBuildings> {
		return this.citiesService.createBuilding(id, body);
	}

	@Post(':id/gain-troop')
	gainTroop(@Param('id', new ParseIntPipe()) id: number, @Body() body: GainTroopDto): Promise<PlayersTroops> {
		return this.citiesService.gainTroop(id, body);
	}

	@Post(':id/gain-resource')
	gainResource(@Param('id', new ParseIntPipe()) id: number, @Body() body: GainResourceDto): Promise<PlayersResources> {
		return this.citiesService.gainResource(id, body);
	}
}
