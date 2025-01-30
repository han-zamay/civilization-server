import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GamesService } from './services/games.service';
import { Game } from './dao/games.entity';
import { SaveGameDto } from './dto/SaveGameDto';
import { Player } from '../player/dao/players.entity';

@Controller('games')
export class GamesController {
    constructor(private readonly gamesService: GamesService) {}

    @Get()
    get(@Query() query): Promise<Game> {
        return this.gamesService.getGame(query);
    }

    @Get('changeActivePlayer')
    changeActivePlayer(@Query() query): Promise<Game> {
        return this.gamesService.changeActivePlayer(query);
    }

    @Get('playersInGame')
    playersInGame(@Query() query): Promise<Player[]> {
        return this.gamesService.getPlayers(query);
    }

    // @Get('changeFase')
    // changeFase(@Query() query): Promise<Game> {
    //     return this.gamesService.changeFase(query);
    // }

    @Post()
    save(@Body() body: SaveGameDto): Promise<Game> {
        return this.gamesService.createGame(body);
    }
}