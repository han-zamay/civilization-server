import { IsDefined } from 'class-validator';
import { TroopsType } from 'src/enums/troops-type';

export class GainTroopDto {
	@IsDefined()
	troopType: TroopsType;
}
