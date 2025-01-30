import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TechnologiesService } from './services/technologies.service';
import { Technology } from './dao/technology.entity';
import { PlayersTechnologies } from '../player/dao/players-technologies.entity';
import { SavePlayersTechnologiesDto } from './dto/SavePlayersTechnologiesDto';
import { Player } from 'src/player/dao/players.entity';
import { TechnologiesActionsService } from './services/technologiesActions.servise';

@Controller('technologies')
export class TechnologiesController {
    constructor(private readonly technologiesService: TechnologiesService,
                private readonly technologiesActionsService: TechnologiesActionsService) {}

    @Get()
    get(@Query() query): Promise<Technology[]> {
        return this.technologiesService.getTechnologes(query);
    }

    @Get('players')
    players(@Query() query): Promise<PlayersTechnologies[]> {
        return this.technologiesService.getPlayerTechnologies(query);
    }

    @Get('HBRA')
    HBRA(@Query() query): Promise<Player> {
        return this.technologiesActionsService.horseBackRidingAction(query);
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