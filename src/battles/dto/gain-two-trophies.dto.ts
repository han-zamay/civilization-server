import { IsEnum, IsNumber, IsOptional } from "class-validator";
import { Technology } from "src/enums/technology";

export class GainTwoTrophiesDto {
    @IsOptional()
    @IsNumber()
    coinToSteal?: number; //0 - steal coin from civ list, otherwise playersTechnologyId

    @IsOptional()
    @IsEnum(Technology)
    technologyToSteal?: Technology;
}