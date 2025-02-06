import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class SaveGameDto {
	@IsDefined()
	@IsNumber(undefined, { each: true })
	@IsArray()
	playersIds: number[];
}
