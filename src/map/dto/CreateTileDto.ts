import { IsBoolean, IsDefined } from 'class-validator';

export class CreateTileDto {
	@IsDefined()
	@IsBoolean()
	isNationTile: boolean;
}