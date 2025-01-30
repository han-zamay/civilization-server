import { IsDefined, IsNumber } from "class-validator";

export class SavePlayersTechnologiesDto {
    @IsDefined()
    @IsNumber()
    playerId: number;

    @IsDefined()
    @IsNumber()
    technologyId: number;
}