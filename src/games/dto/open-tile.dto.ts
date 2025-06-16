import { IsDefined, IsNumber } from 'class-validator';

export class OpenTileDto {
	@IsDefined()
	@IsNumber()
	x: number;

	@IsDefined()
	@IsNumber()
	y: number;
}
