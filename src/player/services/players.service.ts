import { Injectable } from "@nestjs/common";
import { PlayersResourcesRepository } from "src/player/repositories/players-resources.repository";
import { PlayersRepository } from "../repositories/players.repository";
import { PlayersTechnologiesRepository } from "../repositories/players-technologies.repository";

@Injectable()
export class PlayersService {
    constructor(private readonly playersRepository: PlayersRepository,
                private readonly playersTechnologiesRepository: PlayersTechnologiesRepository,
                private readonly playersResourcesRepository: PlayersResourcesRepository) {}
}