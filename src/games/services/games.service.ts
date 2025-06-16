import { BadRequestException, Injectable } from '@nestjs/common';
import { GamesRepository } from '../repositories/games.repository';
import { Game } from '../dao/game.entity';
import { FASE_ORDER } from '../../consts/game-consts';
import { SaveGameDto } from '../dto/save-game.dto';
import { Player } from '../../player/dao/player.entity';
import { PlayersService } from 'src/player/services/players.service';
import { UsersService } from 'src/users/services/users.service';
import { TroopsService } from 'src/troops/troops.service';
import { TroopsType } from 'src/enums/troops-type';
import { BuildingMarketRepository } from '../repositories/building-market.repository';
import { ResourceMarketRepository } from '../repositories/resource-market.repository';
import { Resource } from 'src/enums/resource';
import { BuildingsRepository } from '../repositories/buildings.repository';
import { MapService } from 'src/map/services/map.service';
import { OpenTileDto } from '../dto/open-tile.dto';
import { NationsService } from 'src/nations/services/nations.service';
import { getEmptyTiles, getMatrix } from 'src/utils/getEmptyArray';
import { areCellsAdjust } from 'src/utils/areCellsAdjust';
import { LootFilter, LootRepository } from '../repositories/loot.repository';
import { Loot } from '../dao/loot.entity';
import { CultureCardService } from 'src/culture/services/culture-card.service';

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
		private readonly mapService: MapService,
		private readonly nationsService: NationsService,
		private readonly lootRepository: LootRepository,
		private readonly cultureCardService: CultureCardService,
	) {}

	public get(id: number): Promise<Game> {
		return this.gamesRepository.get(id);
	}

	public getLootList(data: LootFilter): Promise<Loot[]> {
		return this.lootRepository.getList(data);
	}

	public getLoot(data: LootFilter): Promise<Loot> {
		return this.lootRepository.get(data);
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
		if (!currentGame) {
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

	public async openClosedTile(figureId: number, coordinates: OpenTileDto): Promise<Game> {
		const figure = await this.playersService.getPlayersFigure({ id: figureId });
		if (!figure?.cell) {
			throw new BadRequestException('no such figure');
		}
		if (figure.marchPoints < 1) {
			throw new BadRequestException('figure already moved');
		}

		if (!areCellsAdjust(figure.x, figure.y, coordinates.x, coordinates.y)) {
			throw new BadRequestException('cells not adjust');
		}
		const game = await this.gamesRepository.get(figure.player.game.id);
		const map = game.map;
		if (map[coordinates.y][coordinates.x] !== null) {
			throw new BadRequestException('what u want');
		}
		await this.playersService.savePlayersFigure({ id: figure.id, marchPoints: figure.marchPoints - 1 });
		return this.openTile(figure.x, figure.y, game, coordinates);
	}

	public async createGame(data: SaveGameDto): Promise<Game> {
		const userIds = data.userIds;
		userIds.forEach(async (userId) => {
			const currentUser = await this.usersService.get({ id: userId });
			if (!currentUser) {
				throw new BadRequestException('user doesnt exist');
			}
		});

		const nationIds = data.nationIds;
		if (userIds.length !== nationIds.length) {
			throw new BadRequestException('sho take brat?');
		}

		const nationTiles = [];
		for (const nationId of nationIds) {
			const currentNation = await this.nationsService.get(nationId);
			if (!currentNation) {
				throw new BadRequestException('nation doesnt exist');
			}
			nationTiles.push(await this.mapService.getTile(currentNation.tileId));
		}

		const tiles = getEmptyTiles(userIds.length);
		let randomTiles = [];
		const map = getMatrix(16, 16);
		switch (userIds.length) {
			case 2: {
				let k = 0;
				randomTiles = await this.mapService.getTiles(6);
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 2; j++) {
						if (i === 0 && j === 1) {
							tiles[i][j] = nationTiles[0].id;
						} else if (i === 3 && j === 0) {
							tiles[i][j] = nationTiles[1].id;
						} else {
							tiles[i][j] = randomTiles[k].id;
							k++;
						}
					}
				}
				for (let i = 0; i < 16; i++) {
					for (let j = 0; j < 16; j++) {
						if (j > 7) {
							map[i][j] = -1;
						} else {
							map[i][j] = null;
						}
					}
				}
				break;
			}
			case 3: {
				randomTiles = await this.mapService.getTiles(7);
				let z = 0;
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						if (j <= i) {
							if (i === 0 && j === 0) {
								tiles[i][j] = nationTiles[0].id;
							} else if (i === 3 && j === 0) {
								tiles[i][j] = nationTiles[1].id;
							} else if (i === 3 && j === 3) {
								tiles[i][j] = nationTiles[2].id;
							} else {
								tiles[i][j] = randomTiles[z].id;
								z++;
							}
						}
					}
				}
				for (let i = 0; i < 16; i++) {
					for (let j = 0; j < 16; j++) {
						if (i < 4 && (j < 6 || j > 9)) {
							map[i][j] = -1;
						} else if (i > 3 && i < 8 && (j < 4 || j > 11)) {
							map[i][j] = -1;
						} else if (i > 7 && i < 12 && (j < 2 || j > 13)) {
							map[i][j] = -1;
						} else {
							map[i][j] = null;
						}
					}
				}
				break;
			}
			case 4: {
				randomTiles = await this.mapService.getTiles(12);
				let ss = 0;
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						if (i === 0 && j === 0) {
							tiles[i][j] = nationTiles[0].id;
						} else if (i === 0 && j === 3) {
							tiles[i][j] = nationTiles[1].id;
						} else if (i === 3 && j === 0) {
							tiles[i][j] = nationTiles[2].id;
						} else if (i === 3 && j === 3) {
							tiles[i][j] = nationTiles[3].id;
						} else {
							tiles[i][j] = randomTiles[ss].id;
							ss++;
						}
					}
				}
				for (let i = 0; i < 16; i++) {
					for (let j = 0; j < 16; j++) {
						map[i][j] = null;
					}
				}
				break;
			}
			default: {
				throw new BadRequestException('incorrect count of players');
			}
		}
		const newGame = await this.gamesRepository.save({
			playersCount: userIds.length,
			tiles,
			map,
		});
		const buildings = await this.buildingsRepository.getList();

		await Promise.all([
			...buildings.map((building) =>
				this.buildingMarketRepository.save({
					gameId: newGame.id,
					buildingId: building.id,
					amount: building.startingAmount,
				}),
			),
			...MarketResources.map((resource) =>
				this.resourceMarketRepository.save({
					gameId: newGame.id,
					resource,
					amount: newGame.playersCount,
				}),
			),
		]);

		await this.cultureCardService.prepareCultureCards(newGame.id);

		const infantryUnits = await this.troopsService.getList({ type: TroopsType.Infantry });
		const cavalryUnits = await this.troopsService.getList({ type: TroopsType.Cavalry });
		const artilleryUnits = await this.troopsService.getList({ type: TroopsType.Artillery });

		userIds.map(async (userId, i) => {
			const player = await this.playersService.savePlayer({
				gameId: newGame.id,
				userId,
				nationId: nationIds[i],
				playersOrder: i + 1,
			});
			await this.openStartingTile(newGame, i);
			await this.playersService.savePlayersTroops({ playerId: player.id, troopId: infantryUnits[Math.floor(Math.random() * 3)].id });
			await this.playersService.savePlayersTroops({ playerId: player.id, troopId: cavalryUnits[Math.floor(Math.random() * 3)].id });
			await this.playersService.savePlayersTroops({ playerId: player.id, troopId: artilleryUnits[Math.floor(Math.random() * 3)].id });
			await this.createPlayersFigures(player.id);
		});

		return newGame;
	}

	public save(data: Partial<Game>): Promise<Game> {
		return this.gamesRepository.save(data);
	}

	private async createPlayersFigures(playerId: number) {
		const figureTypes = [true, true, true, true, true, false, false];
		await Promise.all(figureTypes.map((type) => this.playersService.savePlayersFigure({ playerId, isArmy: type })));
	}

	private openStartingTile(game: Game, playersTablePosition: number): Promise<Game> {
		let x: number;
		let y: number;
		let coordinateX: number;
		let coordinateY: number;
		if (game.playersCount === 2) {
			x = playersTablePosition % 2 === 0 ? 7 : 0;
			y = playersTablePosition * 17 - 1;
			coordinateX = playersTablePosition % 2 === 0 ? 7 : 0;
			coordinateY = playersTablePosition * 15;
		}

		if (game.playersCount === 3) {
			if (playersTablePosition === 0) {
				x = 6;
				y = -1;
				coordinateX = 6;
				coordinateY = 0;
			} else {
				x = playersTablePosition % 2 === 0 ? -1 : 16;
				y = 15;
				coordinateX = playersTablePosition % 2 === 0 ? 0 : 15;
				coordinateY = 15;
			}
		}

		if (game.playersCount === 4) {
			if (playersTablePosition % 2 === 0) {
				x = 0;
				y = playersTablePosition / 2 === 0 ? -1 : 16;
				coordinateX = 0;
				coordinateY = playersTablePosition / 2 === 0 ? 0 : 15;
			} else {
				x = 15;
				y = playersTablePosition % 3 === 1 ? -1 : 16;
				coordinateX = 15;
				coordinateY = playersTablePosition % 3 === 1 ? 0 : 15;
			}
		}

		return this.openTile(x, y, game, { x: coordinateX, y: coordinateY });
	}

	private async openTile(x: number, y: number, game: Game, coordinates: OpenTileDto): Promise<Game> {
		const tileYPosition = Math.floor(coordinates.y / 4);
		const tileXPosition =
			game.playersCount % 2 === 0 || tileYPosition % 2 !== 0
				? Math.floor(coordinates.x / 4)
				: Math.floor((coordinates.x - (3 - tileYPosition) * 2) / 4);
		const currentTileId = game.tiles[tileYPosition][tileXPosition];
		const currentTile = (await this.mapService.getTile(currentTileId)).cells;
		const mapOpeningX = game.playersCount % 2 === 0 ? tileXPosition * 4 : (3 - tileYPosition) * 2 + tileXPosition * 4;
		const mapOpeningY = tileYPosition * 4;
		const map = game.map;
		if (x === coordinates.x) {
			if (y < coordinates.y) {
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						if (map[i + mapOpeningY][j + mapOpeningX] === null) {
							const cellTemplate = await this.mapService.getCellTemplate({ id: currentTile[3 - i][3 - j] });
							if (cellTemplate.hutMarker || cellTemplate.villageMarker) {
								const loot = await this.getRandomLoot(game.id, cellTemplate.villageMarker);
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									lootId: loot.id,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							} else {
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									relict: cellTemplate.relict,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							}
						}
					}
				}
			}
			if (y > coordinates.y) {
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						if (map[i + mapOpeningY][j + mapOpeningX] === null) {
							const cellTemplate = await this.mapService.getCellTemplate({ id: currentTile[i][j] });
							if (cellTemplate.hutMarker || cellTemplate.villageMarker) {
								const loot = await this.getRandomLoot(game.id, cellTemplate.villageMarker);
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									lootId: loot.id,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							} else {
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									relict: cellTemplate.relict,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							}
						}
					}
				}
			}
		}
		if (y === coordinates.y) {
			if (x < coordinates.x) {
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						if (map[i + mapOpeningY][j + mapOpeningX] === null) {
							const cellTemplate = await this.mapService.getCellTemplate({ id: currentTile[3 - j][i] });
							if (cellTemplate.hutMarker || cellTemplate.villageMarker) {
								const loot = await this.getRandomLoot(game.id, cellTemplate.villageMarker);
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									lootId: loot.id,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							} else {
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									relict: cellTemplate.relict,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							}
						}
					}
				}
			}
			if (x > coordinates.x) {
				for (let i = 0; i < 4; i++) {
					for (let j = 0; j < 4; j++) {
						if (map[i + mapOpeningY][j + mapOpeningX] === null) {
							const cellTemplate = await this.mapService.getCellTemplate({ id: currentTile[j][3 - i] });
							if (cellTemplate.hutMarker || cellTemplate.villageMarker) {
								const loot = await this.getRandomLoot(game.id, cellTemplate.villageMarker);
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									lootId: loot.id,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							} else {
								const cell = await this.mapService.saveCell({
									cellId: cellTemplate.id,
									relict: cellTemplate.relict,
									gameId: game.id,
									x: j + mapOpeningX,
									y: i + mapOpeningY,
								});
								map[i + mapOpeningY][j + mapOpeningX] = cell.id;
							}
						}
					}
				}
			}
		}
		return this.gamesRepository.save({ id: game.id, map });
	}

	private async getRandomLoot(gameId: number, isVillage: boolean): Promise<Loot> {
		const gameCells = await this.mapService.getCells({ gameId });
		const lootInGame = gameCells.reduce((acc, cell) => (cell.loot?.id ? [...acc, cell.loot.id] : acc), []);
		const lootMarket = await this.lootRepository.getList({ isVillage });
		const freeLoot = lootMarket.filter((loot) => !lootInGame.includes(loot.id));
		if (freeLoot.length <= 0) {
			throw new BadRequestException('u sho-to pereputal');
		}
		const randomLoot = freeLoot[Math.floor(Math.random() * freeLoot.length)];
		return randomLoot;
	}
}
