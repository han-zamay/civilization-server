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

@Injectable()
export class CitiesService {
	constructor(
		private readonly citiesRepository: CitiesRepository,
		private readonly citiesBuildingsRepository: CitiesBuildingsRepository,
		private readonly playersService: PlayersService,
		private readonly troopsService: TroopsService,
		private readonly gameService: GamesService,
	) {}

	public get(id: number): Promise<City> {
		return this.citiesRepository.get({ id });
	}

	public async createCity(playerId: number): Promise<City> {
		const currentPlayer = await this.playersService.getPlayer({ id: playerId });
		if (!currentPlayer) {
			throw new BadRequestException('player doesnt exist');
		}
		if (currentPlayer.game.fase !== Fase.Start) {
			throw new BadRequestException('u can build cities only on start fase');
		}

		const citiesCount = (await this.citiesRepository.getList({ playerId })).length;
		if (citiesCount === currentPlayer.citiesLimit) {
			throw new BadRequestException('u have too much cities to build new one');
		}

		if (currentPlayer.game.turn === 1 && citiesCount === 0) {
			return this.citiesRepository.save({
				isCapital: true,
				hammers: Math.floor(Math.random() * 6),
				tradePoints: Math.floor(Math.random() * 7),
				culturePoints: Math.floor(Math.random() * 2),
				possibleResources: [Resource.Silk],
				player: currentPlayer,
				defense: 12,
			});
		}
		return this.citiesRepository.save({
			hammers: Math.floor(Math.random() * 6),
			tradePoints: Math.floor(Math.random() * 7),
			culturePoints: Math.floor(Math.random() * 2),
			possibleResources: [Resource.Iron],
			player: currentPlayer,
		});
	}

	public async createBuilding(id: number, data: CreateBuildingDto): Promise<CitiesBuildings> {
		const city = await this.citiesRepository.get({ id });
		if(!city?.action) {
			throw new BadRequestException('city already did its action');
		}
		const player = await this.playersService.getPlayer({ id: city.player.id }); // i am in shepki from this chickibriki 
		const buildingMarket = await this.gameService.getBuildingMarket({ gameId: player.game.id, buildingId: data.id });
		if(buildingMarket.amount === 0) {
			throw new BadRequestException('no building on the market');
		}

		const building = await this.gameService.getBuilding(data.id);
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
		await this.citiesRepository.save({ id: city.id, action: !city.action });
		await this.gameService.saveBuildingMarket({ id: buildingMarket.id, amount: buildingMarket.amount - 1 });
		return this.citiesBuildingsRepository.save({ cityId: city.id, buildingId: building.id });
	}

	public async gainResource(id: number, data: GainResourceDto): Promise<PlayersResources> {
		const city = await this.citiesRepository.get({ id });
		if (!city?.action) {
			throw new BadRequestException('city already did its action');
		}
		const player = await this.playersService.getPlayer({ id: city.player.id });
		const resourceMarket = await this.gameService.getResourceMarket({ gameId: player.game.id, resource: data.resource });
		if(resourceMarket.amount === 0) {
			throw new BadRequestException('no resource on market');
		}
		if (!city.possibleResources.find((resource) => resource === data.resource)) {
			throw new BadRequestException('u dont have this resource in city');
		}
		await this.citiesRepository.save({ id: city.id, action: !city.action });
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
		await this.citiesRepository.save({ id: city.id, action: !city.action });
		return this.playersService.savePlayersTroops({ playerId: player.id, troopId: newTroop.id });
	}

	public save(data: Partial<City>): Promise<City> {
		return this.citiesRepository.save(data);
	}
}
