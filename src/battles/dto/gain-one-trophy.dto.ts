import { IsDefined, IsNumber, IsOptional } from 'class-validator';

export class GainOneTrophyDto {
    @IsOptional()
	@IsNumber()
	resource?: number;

    @IsOptional()
    @IsNumber()
    culturePoints?: number;

    @IsOptional()
    @IsNumber()
    tradePoints?: number;

    @IsOptional()
    @IsNumber()
    coinToDelete?: number; //0 - delete coin from civ list, otherwise playersTechnologyId

}