import { Injectable } from '@nestjs/common';
import { PlayersResourcesFilter, PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { PlayerFilter, PlayersRepository } from '../repositories/players.repository';
import { PlayersTechnologiesFilter, PlayersTechnologiesRepository } from '../repositories/players-technologies.repository';
import { PlayersTroopsFilter, PlayersTroopsRepository } from '../repositories/players-troops.repository';
import { PlayersTechnologies } from '../dao/player-technology.entity';
import { PlayersResources } from '../dao/player-resource.entity';
import { PlayersTroops } from '../dao/player-troop.entity';
import { Player } from '../dao/player.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class PlayersService {
	constructor(
		private readonly playersRepository: PlayersRepository,
		private readonly playersTechnologiesRepository: PlayersTechnologiesRepository,
		private readonly playersResourcesRepository: PlayersResourcesRepository,
		private readonly playersTroopsRepository: PlayersTroopsRepository,
	) {}

	public getPlayer(filter?: PlayerFilter): Promise<Player> {
		return this.playersRepository.get(filter);
	}

	public getPlayers(filter?: PlayerFilter): Promise<Player[]> {
		return this.playersRepository.getList(filter);
	}

	public savePlayer(filter?: PlayerFilter): Promise<Player> {
		return this.playersRepository.save(filter);
	}

	public getPlayersTechnology(filter?: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.playersTechnologiesRepository.get(filter);
	}

	public getPlayersTechnologies(filter?: PlayersTechnologiesFilter): Promise<PlayersTechnologies[]> {
		return this.playersTechnologiesRepository.getList(filter);
	}

	public savePlayersTechnologies(filter?: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.playersTechnologiesRepository.save(filter);
	}

	public getPlayersResource(filter?: PlayersResourcesFilter): Promise<PlayersResources> {
		return this.playersResourcesRepository.get(filter);
	}

	public getPlayersResources(filter?: PlayersResourcesFilter): Promise<PlayersResources[]> {
		return this.playersResourcesRepository.getList(filter);
	}

	public savePlayersResources(filter?: PlayersResourcesFilter): Promise<PlayersResources> {
		return this.playersResourcesRepository.save(filter);
	}

	public deletePlayersRecource(id: number): Promise<DeleteResult> {
		return this.playersResourcesRepository.delete(id);
	}

	public getPlayersTroops(filter?: PlayersTroopsFilter): Promise<PlayersTroops[]> {
		return this.playersTroopsRepository.getList(filter);
	}

	public savePlayersTroops(filter?: PlayersTroopsFilter): Promise<PlayersTroops> {
		return this.playersTroopsRepository.save(filter);
	}
	
	public deletePlayersTroop(id: number): Promise<DeleteResult> {
		return this.playersTroopsRepository.delete(id);
	}
}
