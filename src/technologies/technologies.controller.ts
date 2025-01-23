import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TechnologiesService } from './services/technologies.service';
import { Technology } from './dao/technology.entity';
import { PlayersTechnologies } from './dao/players-technologies.entity';
import { SavePlayersTechnologiesDto } from './dto/SavePlayersTechnologiesDto';

@Controller('technologies')
export class TechnologiesController {
    constructor(private readonly technologiesService: TechnologiesService) {}

    @Get()
    get(@Query() query): Promise<Technology[]> {
        return this.technologiesService.getTechnologes(query);
    }

    @Get('players')
    players(@Query() query): Promise<PlayersTechnologies[]> {
        return this.technologiesService.getPlayerTechnologies(query);
    }

    @Post()
    savePlayersTechnologies(@Body() body: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
        return this.technologiesService.savePlayersTechnologies(body);
    }

    // @Post()
    // save(@Body() body): Promise<Technology> {
    //     return this.technologiesService.save(body);
    // }
}