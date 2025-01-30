import { BadRequestException, Injectable } from "@nestjs/common";
import { CitiesRepository } from "../repositories/cities.repository";
import { City } from "../dao/cities.entity";
import { CitiesBuildingsRepository } from "../repositories/cities-buildings.repository";
import { CitiesBuildings } from "../dao/cities-buildings";
import { BuildingsRepository } from "../repositories/buildings.repository";
import { PlayersResources } from "src/player/dao/players-resources.entity";
import { PlayersResourcesRepository } from "src/player/repositories/players-resources.repository";
import { GainResourceDto } from "../dto/gainResourceDto";
import { PlayersTroops } from "src/player/dao/players-troops.entity";
import { GainTroopDto } from "../dto/GainTroopDto";
import { TroopsType } from "src/enums/troopsType";
import { PlayersRepository } from "src/player/repositories/players.repository";
import { PlayersTroopsRepository } from "src/player/repositories/players-troops.repository";
import { TroopsRepository } from "src/troops/repositories/troops.repository";

@Injectable()
export class CitiesService {
    constructor(private readonly citiesRepository: CitiesRepository,
                private readonly citiesBuildingsRepository: CitiesBuildingsRepository,
                private readonly buildingRepository: BuildingsRepository,
                private readonly playersResourcesRepository: PlayersResourcesRepository,
                private readonly playersRepository: PlayersRepository,
                private readonly playersTroopsRepository: PlayersTroopsRepository,
                private readonly troopsRepository: TroopsRepository) {}

    // public async getCity(query: { cityId?: number }): Promise<City> {
    //     const city = await this.citiesRepository.getCity(query.cityId);

    //     return city;
    // }

    public async build(query: { cityId: number, buildingId: number }): Promise<CitiesBuildings> {
        const city = await this.citiesRepository.getCity(query.cityId);
        if(!city.action) {
            throw new BadRequestException('city already did its action');
        }
        const building = await this.buildingRepository.getBuilding(query.buildingId);
        if(city.havingSpecialBuilding && building.isSpecial) {
            throw new BadRequestException('u already have special building');
        }
        if(city.hammers < building.hammersPrice) {
            throw new BadRequestException('not enough hammers');
        }
        if(building.isSpecial) {
            this.citiesRepository.save({ id: city.id, havingSpecialBuilding: true });
        }
        return this.citiesBuildingsRepository.save(city.id, building.id);
    }

    public async gainResource(data: GainResourceDto): Promise<PlayersResources> {
        const city = await this.citiesRepository.getCity(data.cityId);
        const possibleResources = city.possibleResources;
        console.log(data, city.possibleResources, typeof possibleResources);
        if(!possibleResources.find((resource) => resource === data.resource)) {
            throw new BadRequestException('u dont have this resource in city');
        }
        return this.playersResourcesRepository.saveResource(city.playerId, data.resource, true);
    }

    public async gainTroop(data: GainTroopDto): Promise<PlayersTroops> {
        const city = await this.citiesRepository.getCity(data.cityId);
        const player = await this.playersRepository.getPlayer({ id: city.playerId });
        let troopPrice;
        switch(data.troopType) {
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
                if(!player.aviation) {
                    throw new BadRequestException('u cannot gain aviation');
                }
                troopPrice = 12;
                break;
        }
        if(city.hammers < troopPrice) {
            throw new BadRequestException('not enough hammers');
        }
        const possibleTroops = await this.troopsRepository.getTroops(data.troopType);
        const newTroop = possibleTroops[Math.floor(Math.random() * 3)];
        return this.playersTroopsRepository.saveTroop(player.id, newTroop.id);
    }

    public save(data: Partial<City>): Promise<City> {
        return this.citiesRepository.save(data);
    }
}