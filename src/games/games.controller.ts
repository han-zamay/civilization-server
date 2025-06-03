import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { GamesService } from './services/games.service';
import { Game } from './dao/game.entity';
import { SaveGameDto } from './dto/save-game.dto';
import { Player } from '../player/dao/player.entity';
import { OpenTileDto } from './dto/open-tile.dto';
import { FigureMoveDto } from './dto/figure-move.dto';
import { figureMoveResponse, MovementService } from './services/movement.service';

@Controller('games')
export class GamesController {
	constructor(
		private readonly gamesService: GamesService,
		private readonly movementService: MovementService,
	) {}

	@Post('figure-move')
	figureMove(@Body() body: FigureMoveDto): Promise<figureMoveResponse> {
		return this.movementService.figureMove(body);
	}

	@Get('validate-path')
	async validatePath(@Body() body: FigureMoveDto): Promise<boolean> {
		const isPathCorrect = await this.movementService.isPathCorrect(body);
		return isPathCorrect.response;
	}

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

	@Post(':id/open-tile')
	openTile(@Param('id', new ParseIntPipe()) id: number, @Body() body: OpenTileDto): Promise<Game> {
		return this.gamesService.openClosedTile(id, body);
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
