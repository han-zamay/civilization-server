import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CitiesService } from "./services/cities.service";
import { CitiesBuildings } from "./dao/cities-buildings";
import { PlayersResources } from "src/player/dao/players-resources.entity";
import { GainResourceDto } from "./dto/gainResourceDto";
import { GainTroopDto } from "./dto/GainTroopDto";
import { PlayersTroops } from "src/player/dao/players-troops.entity";

@Controller('cities')
export class CitiesController {
    constructor(private readonly citiesService: CitiesService) {}

    @Get()
    build(@Query() query): Promise<CitiesBuildings> {
        return this.citiesService.build(query);
    }

    @Post()
    gainResource(@Body() body: GainResourceDto): Promise<PlayersResources> {
        return this.citiesService.gainResource(body);
    }

    @Post('gainTroop')
    gainTroop(@Body() body: GainTroopDto): Promise<PlayersTroops> {
        return this.citiesService.gainTroop(body);
    }
}