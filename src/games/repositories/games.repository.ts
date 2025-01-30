import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../dao/games.entity';

@Injectable()
export class GamesRepository {
    constructor(
        @InjectRepository(Game)
        private readonly repository: Repository<Game>,
    ) {}

    public async getGame(id?: number): Promise<Game> {
        const game = this.repository.findOne({
            where: {
                id,
            },
        });
        return game;
    }

    public save(data: Partial<Game>): Promise<Game> {
        return this.repository.save({
            id: data.id,
            turn: data.turn,
            fase: data.fase,
            activePlayerIndex: data.activePlayerIndex,
            playersCount: data.playersCount,
        });
    }
}