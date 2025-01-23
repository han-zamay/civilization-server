import { IsDefined, IsNumber } from "class-validator";

export class SavePlayersTechnologiesDto {
    @IsDefined()
    @IsNumber()
    playerId: number;

    @IsDefined()
    @IsNumber()
    gameId: number;

    @IsDefined()
    @IsNumber()
    technologyId: number;
}