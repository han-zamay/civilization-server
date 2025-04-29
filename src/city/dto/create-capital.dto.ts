import { IsDefined, IsNumber } from 'class-validator';

export class CreateCapitalDto {
	@IsDefined()
	@IsNumber()
	x: number;

	@IsDefined()
	@IsNumber()
	y: number;
}