import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersTroops } from '../dao/players-troops.entity';
import { TroopsType } from 'src/enums/troopsType';

@Injectable()
export class PlayersTroopsRepository {
    constructor(
        @InjectRepository(PlayersTroops)
        private readonly repository: Repository<PlayersTroops>,
    ) {}
    public async getPlayersTroops(playerId: number, troopsType?: TroopsType): Promise<PlayersTroops[]> {
        const troops = this.repository.find({
            where: {
                player: {
                    id: playerId,
                },
                troop: {
                    type: troopsType,
                }
            },
            relations: {
                player: true,
                troop: true,
            }
        })
        return troops;
    }

    public saveTroop(playerId: number, troopId: number): Promise<PlayersTroops> {
        return this.repository.save({
            player: {
                id: playerId,
            },
            troop: {
                id: troopId,
            }
        });
    }

    public deleteTroop(troopId: number) {
        this.repository.delete(troopId);
    }
}