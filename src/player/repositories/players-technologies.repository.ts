import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersTechnologies } from '../dao/players-technologies.entity';
import { SavePlayersTechnologiesDto } from '../../technologies/dto/SavePlayersTechnologiesDto';

@Injectable()
export class PlayersTechnologiesRepository {
    constructor(
        @InjectRepository(PlayersTechnologies)
        private readonly repository: Repository<PlayersTechnologies>,
    ) {}

    public async getPlayerTechnologies(playerId?: number, technologyId?: number, level?: number): Promise<PlayersTechnologies[]> {

        const playerTechnologies = await this.repository.find({
            where: {
                player: {
                    id: playerId,
                },
                technology: {
                    id: technologyId,
                    level,
                }
            },
            relations: {
                player: true,
                technology: true,
            }
        });
        return playerTechnologies;
    }

    public save(data: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
        return this.repository.save({
            player: {
                id: data.playerId,
            },
            technology: {
                id: data.technologyId,
            }
        });
    }
}