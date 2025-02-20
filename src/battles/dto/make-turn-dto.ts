import { IsDefined, IsNumber } from 'class-validator';

export class MakeTurnDto {
	@IsDefined()
	@IsNumber()
	battleTroopId: number;

    @IsDefined()
	@IsNumber()
	placement: number;
}