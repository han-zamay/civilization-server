import { BadRequestException, Injectable } from '@nestjs/common';
import { GamesRepository } from '../repositories/games.repository';
import { Game } from '../dao/game.entity';
import { FASE_ORDER } from '../constants';
import { SaveGameDto } from '../dto/save-game.dto';
import { Player } from '../../player/dao/player.entity';
import { PlayersService } from 'src/player/services/players.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class GamesService {
	constructor(
		private readonly gamesRepository: GamesRepository,
		private readonly usersService: UsersService,
		private readonly playersService: PlayersService,
	) {}

	public get(id: number): Promise<Game> {
		return this.gamesRepository.get(id);
	}

	public async getPlayers(id: number): Promise<Player[]> {
		const playersInGame = await this.playersService.getPlayers({
			gameId: id,
		});

		if (!playersInGame) {
			throw new BadRequestException('game doesnt exist');
		}

		return playersInGame;
	}

	public async changeActivePlayer(id: number): Promise<Game> {
		const currentGame = await this.gamesRepository.get(id);
		const isFaseChanging = currentGame.activePlayerIndex === currentGame.playersCount;

		if (isFaseChanging) {
			await this.changeFase(currentGame);
		}

		await this.gamesRepository.save({
			id: currentGame.id,
			activePlayerIndex: isFaseChanging ? 1 : currentGame.activePlayerIndex + 1,
		});

		return this.gamesRepository.get(currentGame.id);
	}

	public async changeFase(currentGame: Game): Promise<void> {
		const currentFaseIndex = FASE_ORDER.findIndex((fase) => currentGame.fase === fase);
		const newFaseIndex = FASE_ORDER[currentFaseIndex + 1] ? currentFaseIndex + 1 : 0;

		if (newFaseIndex === 0) {
			const playersInGame = await this.playersService.getPlayers({
				gameId: currentGame.id,
			});
			await Promise.all(
				playersInGame.map(async (playerInGame) => {
					this.playersService.savePlayer({
						id: playerInGame.id,
						playersOrder: playerInGame.playersOrder === playersInGame.length ? 1 : playerInGame.playersOrder + 1,
					});
				}),
			);
		}

		await this.gamesRepository.save({
			id: currentGame.id,
			turn: newFaseIndex === 0 ? currentGame.turn + 1 : currentGame.turn,
			fase: FASE_ORDER[newFaseIndex],
		});
	}

	public async createGame(data: SaveGameDto): Promise<Game> {
		const playersIds = data.playersIds;
		if (playersIds.length < 2 || playersIds.length > 4) {
			throw new BadRequestException('incorrect count of players');
		}

		playersIds.forEach(async (playerId) => {
			const currentPlayer = await this.usersService.get(playerId);
			if (!currentPlayer) {
				throw new BadRequestException('player doesnt exist');
			}
		});

		const newGame = await this.gamesRepository.save({
			playersCount: data.playersIds.length,
		});

		playersIds.forEach(async (playerId, i) => {
			await this.playersService.savePlayer({
				gameId: newGame.id,
				userId: playerId,
				playersOrder: i + 1,
			});
		});

		return newGame;
	}

	public save(data: Partial<Game>): Promise<Game> {
		return this.gamesRepository.save(data);
	}
}
