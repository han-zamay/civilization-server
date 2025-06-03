import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CultureCardService, RaisingCultureLevelResponse } from './services/culture-card.service';
import { CardInGame } from './dao/card-in-game.entity';
import { Player } from 'src/player/dao/player.entity';

@Controller('culture')
export class CultureController {
	constructor(private readonly cultureCardService: CultureCardService) {}

	// @Get(':id')
	// getCardPile(@Param('id', new ParseIntPipe()) id: number): Promise<CardInGame[]> {
	// 	return this.cultureCardService.prepareCultureCards(id);
	// }

	@Post(':id/raise-culture-level')
	raiseCultureLevel(@Param('id', new ParseIntPipe()) id: number): Promise<RaisingCultureLevelResponse> {
		return this.cultureCardService.raiseCultureLevel(id);
	}

}