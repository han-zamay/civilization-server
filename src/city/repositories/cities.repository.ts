import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../dao/cities.entity';

@Injectable()
export class CitiesRepository {
    constructor(
        @InjectRepository(City)
        private readonly repository: Repository<City>,
    ) {}

    public async getCity(id?: number): Promise<City> {
        const city = this.repository.findOne({
            where: {
                id,
            },
        });
        return city;
    }

    public async getPlayersCities(playerId?: number): Promise<City[]> {
        const cities = this.repository.find({
            where: {
                playerId,
            },
        });
        return cities;
    }

    public save(data: Partial<City>): Promise<City> {
        return this.repository.save({
            id: data.id,
            havingSpecialBuilding: data.havingSpecialBuilding,
        });
    }
}