import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '../dao/buildings.entity';

@Injectable()
export class BuildingsRepository {
    constructor(
        @InjectRepository(Building)
        private readonly repository: Repository<Building>,
    ) {}

    public async getBuilding(id?: number): Promise<Building> {
        const building = this.repository.findOne({
            where: {
                id,
            },
        });
        return building;
    }
}