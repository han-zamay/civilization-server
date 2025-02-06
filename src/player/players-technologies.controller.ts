import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlayersTechnologiesService } from './services/players-technologies.service';
import { SavePlayersTechnologiesDto } from './dto/save-players-technologies.dto';
import { PlayersTechnologies } from './dao/player-technology.entity';

@Controller('players/technologies')
export class PlayersTechnologiesController {
	constructor(private readonly playersTechnologiesService: PlayersTechnologiesService) {}

	@Post(':id/learn-technology')
	learnTechnology(@Param('id', new ParseIntPipe()) id: number, @Body() body: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
		return this.playersTechnologiesService.learnTechnology(id, body);
	}
}
