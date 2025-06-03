import { IsDefined, IsEnum } from 'class-validator';
import { Technology } from 'src/enums/technology';

export class SavePlayersTechnologiesDto {
	@IsDefined()
	@IsEnum(Technology)
	technology: Technology;
}
