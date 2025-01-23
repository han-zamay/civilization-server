import { BadRequestException, Injectable } from "@nestjs/common";
import { GamesRepository } from "../repositories/games.repository";
import { Game } from "../dao/games.entity";
import { FASE_ORDER } from "../constants";
import { SaveGameDto } from "../dto/SaveGameDto";
import { Player } from "../dao/players.entity";
import { PlayersRepository } from "../repositories/players.repository";
import { UsersRepository } from "src/users/repositories/users.repository";

@Injectable()
export class GamesService {
    constructor(private readonly gamesRepository: GamesRepository,
        private readonly usersRepository: UsersRepository,
        private readonly playersRepository: PlayersRepository) {}

    public async getGame(query: { gameId?: number }): Promise<Game> {
        const game = await this.gamesRepository.getGame(query.gameId);

        return game;
    }

    public async getPlayers(query: { gameId?: number }): Promise<Player[]> {
        const playersInGame = await this.playersRepository.getPlayers({ gameId: query.gameId });
        if(!playersInGame) {
            throw new BadRequestException('game doesnt exist');
        }
        return playersInGame;
    }

    public async changeActivePlayer(query: { gameId: number }): Promise<Game> {
        const currentGame = await this.gamesRepository.getGame(query.gameId);
        const isFaseChanging = currentGame.activePlayerIndex === currentGame.playersCount;
        if(isFaseChanging) {
            await this.changeFase(currentGame);
        }
        await this.gamesRepository.save({ 
            id: currentGame.id,
            activePlayerIndex: isFaseChanging ? 1 : currentGame.activePlayerIndex + 1,
        });
        return this.gamesRepository.getGame(currentGame.id);
    }

    public async changeFase(currentGame: Game): Promise<void> {
        const currentFaseIndex = FASE_ORDER.findIndex((fase) => currentGame.fase === fase);
        const newFaseIndex = FASE_ORDER[currentFaseIndex + 1] ? currentFaseIndex + 1 : 0;
        if(newFaseIndex === 0) {
            const playersInGame = await this.playersRepository.getPlayers({ gameId: currentGame.id });
            await Promise.all(playersInGame.map(async (playerInGame) => {
                this.playersRepository.save({
                    id: playerInGame.id,
                    playersOrder: playerInGame.playersOrder === playersInGame.length ? 1 : playerInGame.playersOrder + 1,
                })
            }))
        }
        await this.gamesRepository.save({
            id: currentGame.id,
            turn: newFaseIndex === 0 ? currentGame.turn + 1 : currentGame.turn,
            fase: FASE_ORDER[newFaseIndex],
        });
    }

    public async createGame(data: SaveGameDto): Promise<Game> {
        const playersIds = data.playersIds;
        if(playersIds.length < 2 || playersIds.length > 4) {
            throw new BadRequestException('incorrect count of players');
        }
        console.log(playersIds);
        playersIds.forEach(async (playerId) => {
            const currentPlayer = await this.usersRepository.getUser(playerId);
            if(!currentPlayer) {
                throw new BadRequestException('player doesnt exist');
            }
        });
        const newGame = await this.gamesRepository.save({ playersCount: data.playersIds.length });
        playersIds.forEach(async (playerId, i) => {
            this.playersRepository.save({ gameId: newGame.id, playerId, playersOrder: i + 1 });
        });

        return newGame;
    }

    public save(data: Partial<Game>): Promise<Game> {
        return this.gamesRepository.save(data);
    }
}