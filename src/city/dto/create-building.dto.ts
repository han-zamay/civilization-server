import { IsDefined, IsNumber } from 'class-validator';

export class CreateBuildingDto {
	@IsDefined()
	@IsNumber()
	id: number;
}
