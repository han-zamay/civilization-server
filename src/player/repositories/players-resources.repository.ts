import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayersResources } from '../dao/players-resources.entity';
import { Resource } from '../../enums/resource';

@Injectable()
export class PlayersResourcesRepository {
    constructor(
        @InjectRepository(PlayersResources)
        private readonly repository: Repository<PlayersResources>,
    ) {}
    public async getPlayersResource(playerId: number, resourceType: Resource): Promise<PlayersResources> {
        const resource = this.repository.findOne({
            where: {
                player: {
                    id: playerId,
                },
                resourceType,
            },
            relations: {
                player: true,
            }
        })
        return resource;
    }

    public saveResource(playerId: number, resourceType: Resource, isOpen: boolean): Promise<PlayersResources> {
        return this.repository.save({
            player: {
                id: playerId,
            },
            resourceType,
            isOpen,
        });
    }

    public deleteResource(resourceId: number) {
        this.repository.delete(resourceId);
    }
}