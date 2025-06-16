import { BadRequestException, Injectable } from '@nestjs/common';
import { PlayersTechnologiesFilter, PlayersTechnologiesRepository } from '../repositories/players-technologies.repository';
import { PlayersTechnologies } from '../dao/player-technology.entity';
import { SavePlayersTechnologiesDto } from '../dto/save-players-technologies.dto';
import { Player } from '../../player/dao/player.entity';
import { technologiesWithCoins, TechnologyLevelMap } from '../../consts/technology-consts';
import { Technology } from 'src/enums/technology';
import { PlayersService } from 'src/player/services/players.service';

type TechnologySetting = {
	playerId: number;
	technology: Technology;
	level: number;
};

@Injectable()
export class PlayersTechnologiesService {
	constructor(
		private readonly playersTechnologiesRepository: PlayersTechnologiesRepository,
		private readonly playersService: PlayersService,
	) {}

	public getPlayersTechnology(filter?: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.playersTechnologiesRepository.get(filter);
	}

	public getPlayersTechnologies(filter?: PlayersTechnologiesFilter): Promise<PlayersTechnologies[]> {
		return this.playersTechnologiesRepository.getList(filter);
	}

	public savePlayersTechnologies(filter?: PlayersTechnologiesFilter): Promise<PlayersTechnologies> {
		return this.playersTechnologiesRepository.save(filter);
	}

	public async learnTechnology(id: number, data: SavePlayersTechnologiesDto): Promise<PlayersTechnologies> {
		const currentTechnology = data.technology;
		if (!currentTechnology) {
			throw new BadRequestException('technology doesnt exist');
		}
		const currentPlayer = await this.playersService.getPlayer({ id });
		if (!currentPlayer) {
			throw new BadRequestException('player doesnt exist');
		}
		if (currentPlayer.tradePoints < TechnologyLevelMap[currentTechnology] * 5 + 1) {
			throw new BadRequestException('u dont have enough tradePoints');
		}
		const isTechnologySetable = await this.isTechnologySetable({
			playerId: currentPlayer.id,
			technology: currentTechnology,
			level: TechnologyLevelMap[currentTechnology],
		});

		if (!isTechnologySetable) {
			throw new BadRequestException('hueta ne rabotaem');
		}
		const havingCoin = technologiesWithCoins.find((technology) => technology === currentTechnology);
		await this.playersService.savePlayer({
			id: currentPlayer.id,
			tradePoints: havingCoin ? currentPlayer.coins + 1 : currentPlayer.coins,
			coins: havingCoin ? currentPlayer.coins + 1 : currentPlayer.coins,
		});
		return this.playersTechnologiesRepository.save({ playerId: currentPlayer.id, technology: currentTechnology });
	}

	public async stealTechnology(player: Player, technology: Technology): Promise<PlayersTechnologies> {
		const isTechnologySetable = await this.isTechnologySetable({
			playerId: player.id,
			technology,
			level: TechnologyLevelMap[technology],
		});

		if (!isTechnologySetable) {
			throw new BadRequestException('hueta ne rabotaem');
		}
		const havingCoin = technologiesWithCoins.find((playerTechnology) => playerTechnology === technology);
		await this.playersService.savePlayer({ id: player.id, coins: havingCoin ? player.coins + 1 : player.coins });
		return this.playersTechnologiesRepository.save({ playerId: player.id, technology: technology });
	}

	private async isTechnologySetable(data: TechnologySetting): Promise<boolean> {
		const existingTechnology = await this.playersTechnologiesRepository.get({
			playerId: data.playerId,
			technology: data.technology,
		});

		if (existingTechnology) {
			throw new BadRequestException('u already have this technology');
		}

		if (data.level === 1) {
			return true;
		}

		const playerTechnologies = await this.playersTechnologiesRepository.getList({ playerId: data.playerId });
		const thisLevelTech = playerTechnologies.filter((playerTechnology) => TechnologyLevelMap[playerTechnology.technology] === data.level).length;
		const prevLevelTech = playerTechnologies.filter(
			(playerTechnology) => TechnologyLevelMap[playerTechnology.technology] === data.level - 1,
		).length;

		return prevLevelTech - thisLevelTech >= 2 ? true : false;
	}
}
