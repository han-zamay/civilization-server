import { Injectable } from '@nestjs/common';
import { Troop } from './dao/troop.entity';
import { TroopsFilter, TroopsRepository } from './repositories/troops.repository';

@Injectable()
export class TroopsService {
	constructor(private readonly troopsRepository: TroopsRepository) {}

	public get(filter?: TroopsFilter): Promise<Troop> {
		return this.troopsRepository.get(filter);
	}

	public getList(filter?: TroopsFilter): Promise<Troop[]> {
		return this.troopsRepository.getList(filter);
	}
}
