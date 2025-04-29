import { BadRequestException, Injectable } from '@nestjs/common';
import { CitiesRepository } from '../repositories/cities.repository';
import { City } from '../dao/city.entity';
import { CitiesBuildingsRepository } from '../repositories/cities-buildings.repository';
import { CitiesBuildings } from '../dao/city-building.entity';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { GainResourceDto } from '../dto/gain-resource.dto';
import { PlayersTroops } from 'src/player/dao/player-troop.entity';
import { GainTroopDto } from '../dto/gain-troop.dto';
import { TroopsType } from 'src/enums/troops-type';
import { PlayersService } from 'src/player/services/players.service';
import { TroopsService } from 'src/troops/troops.service';
import { CreateBuildingDto } from '../dto/create-building.dto';
import { Fase } from 'src/enums/fase';
import { Resource } from 'src/enums/resource';
import { GamesService } from 'src/games/services/games.service';
import { PlayersFigure } from 'src/player/dao/player-figure.entity';
import { CreateFigureDto } from '../dto/create-figure.dto';
import { MapService } from 'src/map/services/map.service';
import { areCellsAdjust, isCityOutskirt } from 'src/utils/areCellsAdjust';
import { CreateCapitalDto } from '../dto/create-capital.dto';
import { Player } from 'src/player/dao/player.entity';
import { Landscape } from 'src/enums/landscape';
import { Cell } from 'src/map/dao/cell.entity';

export type CreateCityResponse = {
	city: City;
	center: Cell;
}

@Injectable()
export class CitiesService {
	constructor(
		private readonly citiesRepository: CitiesRepository,
		private readonly citiesBuildingsRepository: CitiesBuildingsRepository,
		private readonly playersService: PlayersService,
		private readonly troopsService: TroopsService,
		private readonly gameService: GamesService,
		private readonly mapService: MapService,
	) {}

	public get(id: number): Promise<City> {
		return this.citiesRepository.get({ id });
	}

	public async createCapital(playerId: number, coordinates: CreateCapitalDto): Promise<CreateCityResponse> {
		const currentPlayer = await this.playersService.getPlayer({ id: playerId });
		if(!currentPlayer) {
			throw new BadRequestException('player doesnt exist');
		}
		if(currentPlayer.game.fase !== Fase.Start) {
			throw new BadRequestException('u can build cities only on start fase');
		}

		const citiesCount = (await this.citiesRepository.getList({ playerId })).length;
		if(citiesCount > 0) {
			throw new BadRequestException('u already have a capital');
		}
		return this.saveCity(currentPlayer, coordinates.x, coordinates.y, true);
	}

	public async createCity(figureId: number): Promise<CreateCityResponse> {
		const figure = await this.playersService.getPlayersFigure({ id: figureId });
		if(!figure?.cell) {
			throw new BadRequestException('figure doesnt exist');
		}
		if(figure.player.game.fase !== Fase.Start) {
			throw new BadRequestException('u can build cities only on start fase');
		}
		if(figure.isArmy) {
			throw new BadRequestException('buy yourself scout, huilusha');
		}

		const citiesCount = (await this.citiesRepository.getList({ playerId: figure.player.id })).length;
		if(citiesCount === figure.player.citiesLimit) {
			throw new BadRequestException('u cant build more cities');
		}
		const newCity = await this.saveCity(figure.player, figure.x, figure.y, false);
		if(!newCity) {
			throw new BadRequestException('smth went wrong');
		}
		await this.playersService.savePlayersFigure({ id: figure.id, onField: false, x: null, y: null });
		return newCity;
	}

	public async createBuilding(id: number, data: CreateBuildingDto): Promise<CitiesBuildings> {
		const city = await this.citiesRepository.get({ id });
		if(!city?.action) {
			throw new BadRequestException('city already did its action');
		}
		const building = await this.gameService.getBuilding(data.id);
		if(!building) {
			throw new BadRequestException('no such building');
		}

		const buildingMarket = await this.gameService.getBuildingMarket({ gameId: city.player.game.id, buildingId: building.id });
		if(buildingMarket.amount === 0) {
			throw new BadRequestException('no building on the market');
		}

		if(city.havingSpecialBuilding && building.isSpecial) {
			throw new BadRequestException('u already have special building');
		}
		if(city.hammers < building.hammersPrice) {
			throw new BadRequestException('not enough hammers');
		}
		if(building.isSpecial) {
			await this.citiesRepository.save({
				id: city.id,
				havingSpecialBuilding: true,
			});
		}
		await this.citiesRepository.save({ id: city.id, action: false });
		await this.gameService.saveBuildingMarket({ id: buildingMarket.id, amount: buildingMarket.amount - 1 });
		return this.citiesBuildingsRepository.save({ cityId: city.id, buildingId: building.id });
	}

	public async createFigure(id: number, data: CreateFigureDto): Promise<PlayersFigure> {
		const city = await this.citiesRepository.get({ id });
		if(!city?.action) {
			throw new BadRequestException('city already did its action');
		}

		const figure = await this.playersService.getPlayersFigure({ id: data.figureId });
		if(!figure || figure.cell) {
			throw new BadRequestException('figure cant be createted');
		}

		if(figure.player.id !== city.player.id) {
			throw new BadRequestException('wtf?');
		}

		if(!isCityOutskirt(city.x, city.y, data.x, data.y)) {
			throw new BadRequestException('u cant build figure here');
		}
		const cell = await this.mapService.getCell({ id: city.player.game.map[data.y][data.x] });
		if(cell.armyCount + cell.scoutCount >= figure.player.stakingLimit) {
			throw new BadRequestException('raise yours stacking limit first!');
		}

		if(city.hammers < 4 && figure.isArmy || city.hammers < 6 && !figure.isArmy) {
			throw new BadRequestException('not enough hammers');
		}

		await this.mapService.saveCell({
			id: cell.id,
			scoutCount: figure.isArmy ? cell.scoutCount : cell.scoutCount + 1,
			armyCount: figure.isArmy ? cell.armyCount + 1 : cell.armyCount,
			playerId: figure.player.id,
		});
		await this.citiesRepository.save({ id: city.id, action: false });
		return this.playersService.savePlayersFigure({ id: figure.id, onField: true, x: data.x, y: data.y, marchPoints: city.player.travelSpeed });
	}

	public async gainResource(id: number, data: GainResourceDto): Promise<PlayersResources> {
		const city = await this.citiesRepository.get({ id });
		if (!city?.action) {
			throw new BadRequestException('city already did its action');
		}
		const resourceMarket = await this.gameService.getResourceMarket({ gameId: city.player.game.id, resource: data.resource });
		if(resourceMarket.amount === 0) {
			throw new BadRequestException('no resource on market');
		}
		if (!city.possibleResources.find((resource) => resource === data.resource)) {
			throw new BadRequestException('u dont have this resource in city');
		}
		await this.citiesRepository.save({ id: city.id, action: false });
		await this.gameService.saveResourceMarket({ id: resourceMarket.id, amount: resourceMarket.amount - 1 });
		return this.playersService.savePlayersResources({ playerId: city.player.id, resourceType: data.resource, isOpen: true });
	}

	public async gainTroop(id: number, data: GainTroopDto): Promise<PlayersTroops> {
		const city = await this.citiesRepository.get({ id });
		if (!city?.action) {
			throw new BadRequestException('city already did its action');
		}
		const player = await this.playersService.getPlayer({ id: city.player.id });

		let troopPrice: number;
		switch (data.troopType) {
			case TroopsType.Infantry:
				troopPrice = 5 + (player.infantryLevel - 1) * 2;
				break;
			case TroopsType.Cavalry:
				troopPrice = 5 + (player.cavalryLevel - 1) * 2;
				break;
			case TroopsType.Artillery:
				troopPrice = 5 + (player.artilleryLevel - 1) * 2;
				break;
			case TroopsType.Aviation:
				if (!player.aviation) {
					throw new BadRequestException('u cannot gain aviation');
				}
				troopPrice = 12;
				break;
			default: {
				throw new BadRequestException('wtf');
			}
		}

		if (city.hammers < troopPrice) {
			throw new BadRequestException('not enough hammers');
		}

		const possibleTroops = await this.troopsService.getList({ type: data.troopType });
		const newTroop = possibleTroops[Math.floor(Math.random() * 3)];
		await this.citiesRepository.save({ id: city.id, action: false });
		return this.playersService.savePlayersTroops({ playerId: player.id, troopId: newTroop.id });
	}

	public save(data: Partial<City>): Promise<City> {
		return this.citiesRepository.save(data);
	}

	private async saveCity(player: Player, x: number, y: number, isCapital: boolean ): Promise<CreateCityResponse> {
		let cells = [];
		let map = player.game.map;
		for(let i = y - 1; i < y + 2; i++ ) {
			for(let j = x - 1; j < x + 2; j++ ) {
				if(map[i][j] === null || map[i][j] === -1) {
					throw new BadRequestException('wtf');
				}
				let cell = await this.mapService.getCell({ id: map[i][j] });
				if(!cell || cell.loot || cell.relict) {
					throw new BadRequestException('u cant build city here');
				}
				if(cell.city !== null) {
					throw new BadRequestException('u cant build city next to another city');
				}
				if(cell.player !== null && cell.player?.id !== player.id) {
					throw new BadRequestException('u cant build next to your opponents');
				}
				cells.push(cell);
			}
		}
		const center = cells.splice(4, 1)[0];
		if(center.cell.landscape === Landscape.Water) {
			throw new BadRequestException('u cant build city on water');
		}
		let city = await this.citiesRepository.save({
			isCapital: isCapital,
			hammers: cells.reduce((acc, { cell }) =>  acc + cell.hammers, 0),
			tradePoints: cells.reduce((acc, {cell}) => acc + cell.tradePoints, 0),
			culturePoints: cells.reduce((acc, {cell}) => acc + cell.culturePoints, 0),
			possibleResources: cells.reduce((acc, {cell}) => cell.resource !== null ? [...acc, cell.resource] : acc, []),
			player,
			x,
			y,
			defense: isCapital ? 12 : 6,
		});
		Promise.all(cells.map((cell) => { this.mapService.saveCell({ id: cell.id, cityId: city.id }) }));
		const centerCell = await this.mapService.saveCell({ id: center.id, cityId: city.id, playerId: player.id });
		return { city, center: centerCell };
	}
}
