import { IsDefined, IsEnum } from 'class-validator';
import { Resource } from 'src/enums/resource';

export class GainResourceDto {
	@IsDefined()
	@IsEnum(Resource)
	resource: Resource;
}
