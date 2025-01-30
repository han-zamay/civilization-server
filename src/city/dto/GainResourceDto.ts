import { IsDefined, IsNumber } from "class-validator";
import { Resource } from "src/enums/resource";

export class GainResourceDto {
    @IsDefined()
    @IsNumber()
    cityId: number;

    @IsDefined()
    resource: Resource;
}