import { IsDefined, IsNumber } from 'class-validator';

export class SavePlayersTechnologiesDto {
	@IsDefined()
	@IsNumber()
	technologyId: number;
}
