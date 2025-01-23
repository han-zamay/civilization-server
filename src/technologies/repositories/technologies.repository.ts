import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Technology } from '../dao/technology.entity';

@Injectable()
export class TechnologiesRepository {
    constructor(
        @InjectRepository(Technology)
        private readonly repository: Repository<Technology>,
    ) {}

    public async getTechnologes(id?: number, level?: number): Promise<Technology[]> {
        
        const technologies = this.repository.find({
            where: {
                id,
                level,
            },
        });
        return technologies;
    }

    public async getTechnology(id: number): Promise<Technology> {
        
        const technology = this.repository.findOne({
            where: {
                id,
            },
        });
        return technology;
    }

    public save(data: Partial<Technology>): Promise<Technology> {
        return this.repository.save(data);
    }
}