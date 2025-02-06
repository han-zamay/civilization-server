import { BadRequestException, Injectable } from '@nestjs/common';
import { PlayersRepository } from 'src/player/repositories/players.repository';
import { Player } from 'src/player/dao/player.entity';
import { PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { Resource } from 'src/enums/resource';

@Injectable()
export class TechnologiesActionsService {
	constructor(
		private readonly playersRepository: PlayersRepository,
		private readonly playersResourcesRepository: PlayersResourcesRepository,
	) {}

	public async horseBackRidingAction(query: { activePlayerId: number; passivePlayerId: number }): Promise<Player> {
		const activePlayer = await this.playersRepository.get({
			id: query.activePlayerId,
		});

		const passivePlayer = await this.playersRepository.get({
			id: query.passivePlayerId,
		});

		const playersSilk = await this.playersResourcesRepository.get({ playerId: activePlayer.id, resourceType: Resource.Silk });
		if (!playersSilk) {
			throw new BadRequestException('u have no silk to do this action');
		}

		await this.playersResourcesRepository.delete(playersSilk.id);
		await this.playersRepository.save({
			id: passivePlayer.id,
			tradePoints: passivePlayer.tradePoints + 6,
		});

		return this.playersRepository.save({
			id: activePlayer.id,
			tradePoints: activePlayer.tradePoints + 9,
		});
	}
}
