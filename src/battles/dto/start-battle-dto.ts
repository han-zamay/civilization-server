import { IsDefined, IsNumber } from 'class-validator';

export class StartBattleDto {
	@IsDefined()
	@IsNumber()
	cellId: number;
}