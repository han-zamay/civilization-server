import { BadRequestException, Injectable } from "@nestjs/common";
import { TechnologiesRepository } from "../repositories/technologies.repository";
import { Technology } from "../dao/technology.entity";
import { PlayersTechnologiesRepository } from "../repositories/players-technologies.repository";
import { PlayersTechnologies } from "../dao/players-technologies.entity";
import { SavePlayersTechnologiesDto } from "../dto/SavePlayersTechnologiesDto";
import { PlayersRepository } from "src/games/repositories/players.repository";

@Injectable()
export class TechnologiesService {
    constructor(private readonly technologiesRepository: TechnologiesRepository,
                private readonly playersTechnologiesRepository: PlayersTechnologiesRepository,
                private readonly playersRepository: PlayersRepository) {}

    public async getTechnologes(query: {technologyId?: number, level?: number}): Promise<Technology[]> {
        const technologies = await this.technologiesRepository.getTechnologes(query.technologyId, query.level);

        return technologies;
    }

    public async getPlayerTechnologies(query: {playerId?: number, gameId?: number, technologyId?: number, level?: number}): Promise<PlayersTechnologies[]> {
        const playerTechnologies = await this.playersTechnologiesRepository.getPlayerTechnologies(query.playerId, query.gameId, query.technologyId, query.level);

        return playerTechnologies;
    }

    public async isTechnologySetable(playerId: number, gameId: number, technologyId: number, level: number, tradePoints: number): Promise<boolean> {
        if(tradePoints < level * 5 + 1) {
            throw new BadRequestException('u dont have enough tradePoints');
        }
        const existingTechnology = await this.getPlayerTechnologies({ playerId, gameId, technologyId });
        if(existingTechnology[0] ? true : false) {
            throw new BadRequestException('u already have this technology');
        }
        if(level === 1) {
            return true;
        }
        const thisLevelTech = (await this.getPlayerTechnologies({ playerId, gameId, level })).length;
        const prevLevelTech = (await this.getPlayerTechnologies({ playerId, gameId, level: level - 1})).length;

        return prevLevelTech - thisLevelTech >= 2 ? true : false;
    }

    public async savePlayersTechnologies(data: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
        const currentTechnology = await this.technologiesRepository.getTechnology(data.technologyId);
        const currentPlayer = await this.playersRepository.getPlayer({ gameId: data.gameId, playerId: data.playerId });
        const isTechnologySetable = await this.isTechnologySetable(data.playerId, data.gameId, data.technologyId, currentTechnology.level, currentPlayer.tradePoints);
        if(!isTechnologySetable) {
            throw new BadRequestException('hueta ne rabotaem');
        };
        this.playersRepository.save({
            id: currentPlayer.id,
            tradePoints: currentTechnology.baseCoin ? currentPlayer.coins + 1 : currentPlayer.coins,
            coins: currentTechnology.baseCoin ? currentPlayer.coins + 1 : currentPlayer.coins,
        });
        return this.playersTechnologiesRepository.save(data);
    }

    public save(data: Partial<Technology>): Promise<Technology> {
        return this.technologiesRepository.save(data);
    }
}