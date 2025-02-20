import { BadRequestException, Injectable } from '@nestjs/common';
import { GamesRepository } from '../repositories/games.repository';
import { Game } from '../dao/game.entity';
import { FASE_ORDER } from '../constants';
import { SaveGameDto } from '../dto/save-game.dto';
import { Player } from '../../player/dao/player.entity';
import { PlayersService } from 'src/player/services/players.service';
import { UsersService } from 'src/users/services/users.service';
import { TroopsService } from 'src/troops/troops.service';
import { TroopsType } from 'src/enums/troops-type';
import { BuildingMarketFilter, BuildingMarketRepository } from '../repositories/building-market.repository';
import { ResourceMarketFilter, ResourceMarketRepository } from '../repositories/resource-market.repository';
import { Resource } from 'src/enums/resource';
import { Building } from '../dao/building.entity';
import { BuildingsRepository } from '../repositories/buildings.repository';
import { BuildingMarket } from '../dao/building-market';
import { ResourceMarket } from '../dao/resource-market';

const MarketResources = [Resource.Silk, Resource.Iron, Resource.Incense, Resource.Wheat];

@Injectable()
export class GamesService {
	constructor(
		private readonly gamesRepository: GamesRepository,
		private readonly usersService: UsersService,
		private readonly playersService: PlayersService,
		private readonly troopsService: TroopsService,
		private readonly buildingMarketRepository: BuildingMarketRepository,
		private readonly resourceMarketRepository: ResourceMarketRepository,
		private readonly buildingsRepository: BuildingsRepository,
		
	) {}

	public get(id: number): Promise<Game> {
		return this.gamesRepository.get(id);
	}

	public getBuilding(id: number): Promise<Building> {
		return this.buildingsRepository.get(id);
	}

	public getBuildings(): Promise<Building[]> {
		return this.buildingsRepository.getList();
	}

	public getBuildingMarket(data: BuildingMarketFilter): Promise<BuildingMarket> {
		return this.buildingMarketRepository.get({ gameId: data.gameId, buildingId: data.buildingId });
	}

	public saveBuildingMarket(data: BuildingMarketFilter): Promise<BuildingMarket> {
		return this.buildingMarketRepository.save(data);
	}

	public getResourceMarket(data: ResourceMarketFilter): Promise<ResourceMarket> {
		return this.resourceMarketRepository.get({ gameId: data.gameId, resource: data.resource });
	}

	public saveResourceMarket(data: ResourceMarketFilter): Promise<ResourceMarket> {
		return this.resourceMarketRepository.save(data);
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
		if(!currentGame) {
			throw new BadRequestException('ti chmo');
		}
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
		const userIds = data.userIds;
		if (userIds.length < 2 || userIds.length > 4) {
			throw new BadRequestException('incorrect count of players');
		}

		userIds.forEach(async (userId) => {
			const currentPlayer = await this.usersService.get(userId);
			if (!currentPlayer) {
				throw new BadRequestException('player doesnt exist');
			}
		});

		const newGame = await this.gamesRepository.save({
			playersCount: data.userIds.length,
		});
		const buildings = await this.buildingsRepository.getList();

		await Promise.all([
			...buildings.map((building) => this.buildingMarketRepository.save({
				gameId: newGame.id,
				buildingId: building.id,
				amount: building.startingAmount,
				})),
			...MarketResources.map((resource) => this.resourceMarketRepository.save({
				gameId: newGame.id,
				resource,
				amount: newGame.playersCount,
			}))]);
		
		const infantryUnits = await this.troopsService.getList({ type: TroopsType.Infantry });
		const cavalryUnits = await this.troopsService.getList({ type: TroopsType.Cavalry });
		const artilleryUnits = await this.troopsService.getList({ type: TroopsType.Artillery });

		userIds.map(async (userId, i) => {
			const player = await this.playersService.savePlayer({
				gameId: newGame.id,
				userId,
				playersOrder: i + 1,
			});
			await this.playersService.savePlayersTroops({ playerId: player.id, troopId: infantryUnits[Math.floor(Math.random() * 3)].id });
			await this.playersService.savePlayersTroops({ playerId: player.id, troopId: cavalryUnits[Math.floor(Math.random() * 3)].id });
			await this.playersService.savePlayersTroops({ playerId: player.id, troopId: artilleryUnits[Math.floor(Math.random() * 3)].id });
		})

		return newGame;
	}

	public save(data: Partial<Game>): Promise<Game> {
		return this.gamesRepository.save(data);
	}
}
