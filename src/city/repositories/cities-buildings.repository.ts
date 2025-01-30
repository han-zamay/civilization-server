import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CitiesBuildings } from '../dao/cities-buildings';

@Injectable()
export class CitiesBuildingsRepository {
    constructor(
        @InjectRepository(CitiesBuildings)
        private readonly repository: Repository<CitiesBuildings>,
    ) {}

    public async getBuildings(cityId?: number): Promise<CitiesBuildings[]> {
        const buildings = this.repository.find({
            where: {
                city: {
                    id: cityId
                }
            },
        });
        return buildings;
    }

    public save(cityId: number, buildingId: number): Promise<CitiesBuildings> {
        return this.repository.save({
            city: {
                id: cityId
            },
            building: {
                id: buildingId
            },
        });
    }
}