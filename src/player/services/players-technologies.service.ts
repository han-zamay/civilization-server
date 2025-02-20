import { BadRequestException, Injectable } from '@nestjs/common';
import { PlayersTechnologiesFilter, PlayersTechnologiesRepository } from '../repositories/players-technologies.repository';
import { PlayersTechnologies } from '../dao/player-technology.entity';
import { SavePlayersTechnologiesDto } from '../dto/save-players-technologies.dto';
import { PlayersRepository } from 'src/player/repositories/players.repository';
import { TechnologiesService } from 'src/technologies/services/technologies.service';
import { Technology } from 'src/technologies/dao/technology.entity';
import { Player } from '../dao/player.entity';

type TechnologySetting = {
	playerId: number;
	technologyId: number;
	level: number;
};

@Injectable()
export class PlayersTechnologiesService {
	constructor(
		private readonly playersTechnologiesRepository: PlayersTechnologiesRepository,
		private readonly playersRepository: PlayersRepository,
		private readonly technologiesService: TechnologiesService,
	) {}

	public async learnTechnology(id: number, data: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
		const currentTechnology = await this.technologiesService.get({ id: data.technologyId });
		if (!currentTechnology) {
			throw new BadRequestException('technology doesnt exist');
		}
		const currentPlayer = await this.playersRepository.get({ id });
		if (!currentPlayer) {
			throw new BadRequestException('player doesnt exist');
		}
		if (currentPlayer.tradePoints < currentTechnology.level * 5 + 1) {
			throw new BadRequestException('u dont have enough tradePoints');
		}
		const isTechnologySetable = await this.isTechnologySetable({
			playerId: currentPlayer.id,
			technologyId: currentTechnology.id,
			level: currentTechnology.level,
		});

		if (!isTechnologySetable) {
			throw new BadRequestException('hueta ne rabotaem');
		}
		await this.playersRepository.save({
			id: currentPlayer.id,
			tradePoints: currentTechnology.baseCoin ? currentPlayer.coins + 1 : currentPlayer.coins,
			coins: currentTechnology.baseCoin ? currentPlayer.coins + 1 : currentPlayer.coins,
		});
		return this.playersTechnologiesRepository.save({ playerId: currentPlayer.id, technologyId: currentTechnology.id });
	}

	public async stealTechnology(player: Player, technology: Technology): Promise<PlayersTechnologies> {
		const isTechnologySetable = await this.isTechnologySetable({
			playerId: player.id,
			technologyId: technology.id,
			level: technology.level,
		});

		if (!isTechnologySetable) {
			throw new BadRequestException('hueta ne rabotaem');
		}
		await this.playersRepository.save({ id: player.id, coins: technology.baseCoin ? player.coins + 1 : player.coins });
		return this.playersTechnologiesRepository.save({ playerId: player.id, technologyId: technology.id});
	}

	private async isTechnologySetable(data: TechnologySetting): Promise<boolean> {

		const existingTechnology = await this.playersTechnologiesRepository.get({
			playerId: data.playerId,
			technologyId: data.technologyId,
		});

		if (existingTechnology) {
			throw new BadRequestException('u already have this technology');
		}

		if (data.level === 1) {
			return true;
		}

		const thisLevelTech = (await this.playersTechnologiesRepository.getList({ playerId: data.playerId, level: data.level })).length;
		const prevLevelTech = (await this.playersTechnologiesRepository.getList({ playerId: data.playerId, level: data.level - 1 })).length;

		return prevLevelTech - thisLevelTech >= 2 ? true : false;
	}
}
