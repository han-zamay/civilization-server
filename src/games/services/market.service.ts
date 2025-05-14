import { Injectable } from "@nestjs/common";
import { BuildingMarket } from "../dao/building-market.entity";
import { ResourceMarket } from "../dao/resource-market.entity";
import { BuildingMarketFilter, BuildingMarketRepository } from "../repositories/building-market.repository";
import { ResourceMarketFilter, ResourceMarketRepository } from "../repositories/resource-market.repository";
import { BuildingsRepository } from "../repositories/buildings.repository";
import { Building } from "../dao/building.entity";

@Injectable()
export class MarketService {
	constructor(
		private readonly buildingMarketRepository: BuildingMarketRepository,
		private readonly resourceMarketRepository: ResourceMarketRepository,
		private readonly buildingsRepository: BuildingsRepository,		
	) {}

    public getBuilding(id: number): Promise<Building> {
		return this.buildingsRepository.get(id);
	}

	public getBuildings(): Promise<Building[]> {
		return this.buildingsRepository.getList();
	}

    public getBuildingMarket(data: BuildingMarketFilter): Promise<BuildingMarket> {
		return this.buildingMarketRepository.get({ gameId: data.gameId, buildingId: data.buildingId });
	}

    public getBuildingMarketList(data: BuildingMarketFilter): Promise<BuildingMarket[]> {
		return this.buildingMarketRepository.getList({ gameId: data.gameId, buildingId: data.buildingId });
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
}