import { IsDefined, IsNumber } from "class-validator";
import { TroopsType } from "src/enums/troopsType";

export class GainTroopDto {
    @IsDefined()
    @IsNumber()
    cityId: number;

    @IsDefined()
    troopType: TroopsType;
}