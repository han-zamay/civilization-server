import { IsDefined, IsNumber } from 'class-validator';

export class CreateFigureDto {
	@IsDefined()
	@IsNumber()
	figureId: number;

	@IsDefined()
	@IsNumber()
	x: number;

	@IsDefined()
	@IsNumber()
	y: number;
}
