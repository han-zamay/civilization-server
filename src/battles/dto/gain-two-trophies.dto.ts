import { IsNumber, IsOptional } from "class-validator";

export class GainTwoTrophiesDto {
    @IsOptional()
    @IsNumber()
    coinToSteal?: number; //0 - steal coin from civ list, otherwise playersTechnologyId

    @IsOptional()
    @IsNumber()
    technologyToSteal?: number;
}