import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { GamesService } from './services/games.service';
import { Game } from './dao/game.entity';
import { SaveGameDto } from './dto/save-game.dto';
import { Player } from '../player/dao/player.entity';

@Controller('games')
export class GamesController {
	constructor(private readonly gamesService: GamesService) {}

	@Get(':id')
	get(@Param('id', new ParseIntPipe()) id: number): Promise<Game> {
		return this.gamesService.get(id);
	}

	@Patch(':id/change-active-player')
	changeActivePlayer(@Param('id', new ParseIntPipe()) id: number): Promise<Game> {
		return this.gamesService.changeActivePlayer(id);
	}

	@Get(':id/players-in-game')
	playersInGame(@Param('id', new ParseIntPipe()) id: number): Promise<Player[]> {
		return this.gamesService.getPlayers(id);
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
