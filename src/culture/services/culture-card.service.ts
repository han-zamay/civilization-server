import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CardInGameFilter, CardInGameRepository } from '../repositories/card-in-game.repository';
import { CultureCardCounts, CultureCardLevels, CultureTrack } from '../../consts/culture-consts';
import { CultureCard } from 'src/enums/cultureCard';
import { CardInGame } from '../dao/card-in-game.entity';
import { Player } from 'src/player/dao/player.entity';
import { PlayersService } from 'src/player/services/players.service';

export type RaisingCultureLevelResponse = {
	player: Player;
	card: CardInGame;
};

@Injectable()
export class CultureCardService {
	constructor(
		private readonly cultureCardRepository: CardInGameRepository,
		private readonly playersService: PlayersService,
	) {}

	public getCard(filter: CardInGameFilter): Promise<CardInGame> {
		return this.cultureCardRepository.get(filter);
	}

	public getCards(filter: CardInGameFilter): Promise<CardInGame[]> {
		return this.cultureCardRepository.getList(filter);
	}

	public save(filter: CardInGameFilter): Promise<CardInGame> {
		return this.cultureCardRepository.save(filter);
	}

	public async raiseCultureLevel(id: number): Promise<RaisingCultureLevelResponse> {
		const player = await this.playersService.getPlayer({ id });
		if (!player) {
			throw new NotFoundException('player not found');
		}
		const playersCards = await this.cultureCardRepository.getList({ playerId: player.id });
		if (playersCards.length === player.cultureHandSize) {
			throw new BadRequestException('mb u should to discard smth');
		}
		const cultureTrackStep = CultureTrack[player.cultureLevel + 1];
		const canTakeStep = player.culturePoints >= cultureTrackStep.culturePrice && player.tradePoints >= cultureTrackStep.tradePrice;
		if (!canTakeStep) {
			throw new BadRequestException('not enough resources to take step forward');
		}
		let card: CardInGame;
		switch (cultureTrackStep.reward) {
			case 'greatPerson': {
				throw new BadRequestException('we didnt invent great people yet');
			}
			case 'firstLevelCard': {
				card = await this.gainCultureCard(player, 1);
				break;
			}
			case 'secondLevelCard': {
				card = await this.gainCultureCard(player, 2);
				break;
			}
			case 'thirdLevelCard': {
				card = await this.gainCultureCard(player, 3);
				break;
			}
			case 'win': {
				throw new BadRequestException('u are winning son');
			}
			default: {
				throw new BadRequestException('pupupuuuuuuu');
			}
		}
		const refreshedPlayer = await this.playersService.savePlayer({
			id: player.id,
			cultureLevel: player.cultureLevel + 1,
			tradePoints: player.tradePoints - cultureTrackStep.tradePrice,
			culturePoints: player.culturePoints - cultureTrackStep.culturePrice,
		});
		return { player: refreshedPlayer, card };
	}

	public async prepareCultureCards(gameId: number): Promise<CardInGame[]> {
		const cards = Object.values(CultureCard);
		const allCards = cards.map((card) => Array(CultureCardCounts[card]).fill(card)).flat();

		const culturePile = this.cultureCardRepository.saveMany(
			allCards.map((card) => ({
				name: card,
				gameId,
				playerId: null,
			})),
		);
		return culturePile;
	}

	private async gainCultureCard(player: Player, level: number): Promise<CardInGame> {
		const cardsInGame = await this.cultureCardRepository.getList({ gameId: player.game.id });
		let properLevelCards = cardsInGame.filter((card) => !card.isUsed && CultureCardLevels[card.name] === level && card.player === null);
		if (properLevelCards.length === 0) {
			properLevelCards = cardsInGame.filter((card) => card.isUsed && CultureCardLevels[card.name] === level);
			await this.cultureCardRepository.saveMany(
				properLevelCards.map((card) => ({
					id: card.id,
					isUsed: false,
				})),
			);
		}
		properLevelCards.sort(() => Math.floor(Math.random() * 3 - 1));
		return this.cultureCardRepository.save({
			id: properLevelCards[0].id,
			playerId: player.id,
		});
	}
}
