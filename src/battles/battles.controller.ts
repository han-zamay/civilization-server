import { Body, Controller, Param, ParseIntPipe, Post } from "@nestjs/common";
import { BattlesService, GainOneTrophyResponse, GainTwoTrophiesResponse, MakeTurnResponse } from "./services/battles.service";
import { StartBattleDto } from "./dto/start-battle-dto";
import { Battle } from "./dao/battle.entity";
import { MakeTurnDto } from "./dto/make-turn-dto";
import { GainOneTrophyDto } from "./dto/gain-one-trophy.dto";
import { GainTwoTrophiesDto } from "./dto/gain-two-trophies.dto";

@Controller('battles')
export class BattlesController {
	constructor(private readonly battlesService: BattlesService) {}

	@Post(':id/start-battle')
	startBattle(@Param('id', new ParseIntPipe()) id: number, @Body() body: StartBattleDto): Promise<Battle> {
		return this.battlesService.startBattle(id, body);
	}

	@Post(':id/make-turn')
	makeTurn(@Param('id', new ParseIntPipe()) id: number, @Body() body: MakeTurnDto): Promise<MakeTurnResponse> {
		return this.battlesService.makeTurn(id, body);
	}

	@Post(':id/gain-one-trophy')
	gainOneTrophy(@Param('id', new ParseIntPipe()) id: number, @Body() body: GainOneTrophyDto): Promise<GainOneTrophyResponse> {
		return this.battlesService.gainOneTrophy(id, body);
	}

	@Post(':id/gain-two-trophies')
	gainTwoTrophies(@Param('id', new ParseIntPipe()) id: number, @Body() body: GainTwoTrophiesDto): Promise<GainTwoTrophiesResponse> {
		return this.battlesService.gainTwoTrophies(id, body);
	}
}