import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersTechnologies } from '../dao/players-technologies.entity';
import { SavePlayersTechnologiesDto } from '../dto/SavePlayersTechnologiesDto';

@Injectable()
export class PlayersTechnologiesRepository {
    constructor(
        @InjectRepository(PlayersTechnologies)
        private readonly repository: Repository<PlayersTechnologies>,
    ) {}

    public async getPlayerTechnologies(playerId?: number, gameId?: number, technologyId?: number, level?: number): Promise<PlayersTechnologies[]> {

        const playerTechnologies = await this.repository.find({
            where: {
                player: {
                    id: playerId,
                },
                game: {
                    id: gameId,
                },
                technology: {
                    id: technologyId,
                    level,
                }
            },
            relations: {
                player: true,
                technology: true,
                game: true,
            }
        });
        return playerTechnologies;
    }

    public save(data: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
        return this.repository.save({
            player: {
                id: data.playerId,
            },
            game: {
                id: data.gameId,
            },
            technology: {
                id: data.technologyId,
            }
        });
    }
}