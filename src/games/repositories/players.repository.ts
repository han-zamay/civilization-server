import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Player } from '../dao/players.entity';
export type PlayerFilter = {
    id?: number,
    gameId?: number,
    playerId?: number,
    playersOrder?: number,
    coins?: number,
    tradePoints?: number
}
@Injectable()
export class PlayersRepository {
    constructor(
        @InjectRepository(Player)
        private readonly repository: Repository<Player>,
    ) {}

    public async getPlayers(filter: PlayerFilter): Promise<Player[]> {
        const players = this.repository.find({
            where: this.toWhereOptions(filter),
            relations: {
                game: true,
                player: true
            }
        });
        return players;
    }

    public async getPlayer(filter: PlayerFilter): Promise<Player> {
        const player = this.repository.findOne({
            where: this.toWhereOptions(filter),
            relations: {
                game: true,
                player: true
            }
        });
        return player;
    }

    public save(data: PlayerFilter): Promise<Player> {
        return this.repository.save({
            id: data.id,
            game: {
                id: data.gameId,
            },
            player: {
                id: data.playerId,
            },
            playersOrder: data.playersOrder,
            coins: data.coins,
            tradePoints: data.tradePoints,
        });
    }
    private toWhereOptions(filter: PlayerFilter): FindOptionsWhere<Player> {
        return {
            id: filter.id,
            game: {
                id: filter.gameId,
            },
            player: {
                id: filter.playerId,
            },
            playersOrder: filter.playersOrder,
            coins: filter.coins,
            tradePoints: filter.tradePoints,
        }
    }
}