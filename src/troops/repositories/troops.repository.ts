import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Troop } from '../dao/troops.entity';
import { TroopsType } from 'src/enums/troopsType';

@Injectable()
export class TroopsRepository {
    constructor(
        @InjectRepository(Troop)
        private readonly repository: Repository<Troop>,
    ) {}

    public async getTroops(type: TroopsType): Promise<Troop[]> {
        const troops = this.repository.find({
            where: {
                type,
            },
        });
        return troops;
    }
}