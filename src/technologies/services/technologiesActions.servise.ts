import { BadRequestException, Injectable } from "@nestjs/common";
import { PlayersRepository } from "src/player/repositories/players.repository";
import { Player } from "src/player/dao/players.entity";
import { PlayersResourcesRepository } from "src/player/repositories/players-resources.repository";
import { Resource } from "src/enums/resource";

@Injectable()
export class TechnologiesActionsService {
    constructor( private readonly playersRepository: PlayersRepository,
                 private readonly resourcesRepository: PlayersResourcesRepository ) {}

    public async horseBackRidingAction(query: { activePlayerId: number, passivePlayerId: number }): Promise<Player> {
        const activePlayer = await this.playersRepository.getPlayer({ id: query.activePlayerId });
        const passivePlayer = await this.playersRepository.getPlayer({ id: query.passivePlayerId });
        const playersSilk = await this.resourcesRepository.getPlayersResource(activePlayer.id, Resource.Silk);
        if(!playersSilk) {
            throw new BadRequestException('u have no silk to do this action');
        }
        this.resourcesRepository.deleteResource(playersSilk.id);
        this.playersRepository.save({ id: passivePlayer.id, tradePoints: passivePlayer.tradePoints + 6 });
        return this.playersRepository.save({ id: activePlayer.id, tradePoints: activePlayer.tradePoints + 9 });
    }
}