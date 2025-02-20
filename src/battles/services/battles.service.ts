import { BadRequestException, Injectable } from "@nestjs/common";
import { GamesService } from "src/games/services/games.service";
import { PlayersService } from "src/player/services/players.service";
import { TroopsService } from "src/troops/troops.service";
import { BattleRepository } from "../repositories/battle.repository";
import { BattleTroopsRepository } from "../repositories/battle-troops.repository";
import { BattleTroops } from "../dao/battle-troops.entity";
import { Battle } from "../dao/battle.entity";
import { TroopsType } from "src/enums/troops-type";
import { PlayersTroops } from "src/player/dao/player-troop.entity";
import { StartBattleDto } from "../dto/start-battle-dto";
import { MakeTurnDto } from "../dto/make-turn-dto";
import { Player } from "src/player/dao/player.entity";
import { GainOneTrophyDto } from "../dto/gain-one-trophy.dto";
import { PlayersResources } from "src/player/dao/player-resource.entity";
import { GainTwoTrophiesDto } from "../dto/gain-two-trophies.dto";
import { PlayersTechnologiesService } from "src/player/services/players-technologies.service";
import { PlayersTechnologies } from "src/player/dao/player-technology.entity";

export type MakeTurnResponse = { 
	troop: BattleTroops,
	winnerId?: number, 
}

export type GainOneTrophyResponse = {
	resource?: PlayersResources,
	player?: Player,
}

export type GainTwoTrophiesResponse = {
	technology?: PlayersTechnologies,
	player?: Player,
}

@Injectable()
export class BattlesService {
	constructor(
		private readonly battleRepository: BattleRepository,
		private readonly battleTroopsRepository: BattleTroopsRepository,
		private readonly gamesService: GamesService,
		private readonly playersService: PlayersService,
		private readonly playersTechnologiesService: PlayersTechnologiesService,
		private readonly troopsService: TroopsService,
	) {}
	
	public async startBattle(attackPlayerId: number, data: StartBattleDto): Promise<Battle> {
		const attackTroops = await this.playersService.getPlayersTroops({ playerId: attackPlayerId });
		const defenseTroops = await this.playersService.getPlayersTroops({ playerId: data.id });

		attackTroops.sort(() => Math.floor(Math.random() * 3 - 1));
		defenseTroops.sort(() => Math.floor(Math.random() * 3 - 1));

		const attackTroopsToSave = attackTroops.slice(0, 3);
		const defenseTroopsToSave = defenseTroops.slice(0, 3);

		const battle = await this.battleRepository.save({ attackPlayerId, defensePlayerId: data.id });
		const attackAdvantage = (await this.playersService.getPlayer({ id: battle.attackPlayer.id })).advantage;
		const defenseAdvantage = (await this.playersService.getPlayer({ id: battle.defensePlayer.id })).advantage;
		if(attackAdvantage > defenseAdvantage) {
			this.battleTroopsRepository.save({
				troopType: TroopsType.Advantage,
				attack: attackAdvantage - defenseAdvantage,
				health: attackAdvantage - defenseAdvantage,
				playerId: battle.attackPlayer.id,
				battleId: battle.id,
			});
		}
		if(defenseAdvantage > attackAdvantage) {
			this.battleTroopsRepository.save({
				troopType: TroopsType.Advantage,
				attack: defenseAdvantage - attackAdvantage,
				health: defenseAdvantage - attackAdvantage,
				playerId: battle.defensePlayer.id,
				battleId: battle.id,
			});
		}

		await Promise.all([
			...attackTroopsToSave.map(troop => {
				this.saveBattleTroop(troop, battle.id);
			}),
			...defenseTroopsToSave.map(troop => {
				this.saveBattleTroop(troop, battle.id);
			}),
		]);

		return battle;
	}

    public async makeTurn(battleId: number, data: MakeTurnDto): Promise<MakeTurnResponse> {
        const currentBattle = await this.battleRepository.get({ id: battleId });
		if(!currentBattle) {
			throw new BadRequestException('battle doesnt exist');
		}
		const currentTroop = await this.battleTroopsRepository.get({ id: data.battleTroopId });
		if(!currentTroop || data.placement < 0 || currentBattle.id !== currentTroop.battle.id) {
			throw new BadRequestException('kavo???');
		}
		if(currentBattle.isAttackTurn && currentBattle.attackPlayer.id !== currentTroop.player.id) {
			throw new BadRequestException('sho vi tut perform?');
		}
		if(!currentBattle.isAttackTurn && currentBattle.defensePlayer.id !== currentTroop.player.id) {
			throw new BadRequestException('sho vi tut perform?');
		}
		const tropsByPlacement = await this.battleTroopsRepository.getList({ battleId, placement: data.placement });

		const allyTroop = tropsByPlacement.find((troop) => troop.player.id === currentTroop.player.id);
		if(allyTroop) {
			throw new BadRequestException('ti huilusha');
		}
		await this.battleTroopsRepository.save({
			id: currentTroop.id,
			placement: data.placement,
		});

		const fightingTroop = await this.battleTroopsRepository.get({ id: currentTroop.id });
		const opponentTroop = tropsByPlacement.find((troop) => troop.player.id !== currentTroop.player.id);
		if(opponentTroop) {
			await this.fight(fightingTroop, opponentTroop);
		}

		const allTroops = await this.battleTroopsRepository.getList({ battleId, placement: -1 });

		const troopToSave = await this.battleTroopsRepository.get({ id: fightingTroop.id });
		if(!allTroops[0]) {
			return {
				troop: troopToSave,
				winnerId: await this.getWinnerId(currentBattle)[0],
			}
		}
		const passivePlayerBattleTroops = await this.battleTroopsRepository.getList({ battleId: currentBattle.id, playerId: currentBattle.isAttackTurn ? currentBattle.defensePlayer.id : currentBattle.attackPlayer.id, placement: -1 });
		await this.battleRepository.save({ id: currentBattle.id, isAttackTurn: passivePlayerBattleTroops[0] ? !currentBattle.isAttackTurn : currentBattle.isAttackTurn });
		return { troop: troopToSave };
	}

	public async gainOneTrophy(id: number, data: GainOneTrophyDto): Promise<GainOneTrophyResponse> {
		const battle = await this.battleRepository.get({ id });
		if(!battle) {
			throw new BadRequestException('you have battles in wrong order mudila');
		}
		if(battle.trophies < 1) {
			throw new BadRequestException('wtf?');
		}
		const wantedTrophies = Object.keys(data);
		if(wantedTrophies.length > 1) {
			throw new BadRequestException('ti chmonya');
		}
		const winner = await this.playersService.getPlayer({ id: battle.winnerId });
		const loser = await this.playersService.getPlayer({ id: battle.loserId });
		switch(wantedTrophies[0]) {
			case 'resource': {
				const resourceToStole = await this.playersService.getPlayersResource({ id: data.resource, playerId: loser.id });
				if(!resourceToStole) {
					throw new BadRequestException('player dont have this resource');
				}
				await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 1 });
				const resource =  await this.playersService.savePlayersResources({ id: resourceToStole.id, playerId: winner.id });
				return { resource };
			}
			case 'culturePoints': {
				if(data.culturePoints > 3) {
					throw new BadRequestException('dohuya hotim');
				}
				const stolenCulturePoints = loser.culturePoints >= data.culturePoints ? data.culturePoints : loser.culturePoints;
				await this.playersService.savePlayer({ id: loser.id, culturePoints: loser.culturePoints - stolenCulturePoints });
				await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 1 });
				const player = await this.playersService.savePlayer({ id: winner.id, culturePoints: winner.culturePoints + stolenCulturePoints });
				return { player };
			}
			case 'tradePoints': {
				if(data.culturePoints > 3) {
					throw new BadRequestException('dohuya hotim');
				}
				const stolenTradePoints = loser.tradePoints >= data.tradePoints ? data.tradePoints : loser.tradePoints;
				await this.playersService.savePlayer({ id: loser.id, tradePoints: loser.tradePoints - stolenTradePoints });
				await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 1 });
				const player = await this.playersService.savePlayer({ id: winner.id, tradePoints: winner.tradePoints + stolenTradePoints });
				return { player };
			}
			case 'coinToDelete': {
				if(data.coinToDelete === 0) {
					if(loser.coinsOnList === 0) {
						throw new BadRequestException('player doesnt have coin on his list');
					}
					await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 1 });
					const player = await this.playersService.savePlayer({ id: loser.id, coinsOnList: loser.coinsOnList - 1, coins: loser.coins - 1 });
					return { player };
				}
				const playerTechnology = await this.playersService.getPlayersTechnology({ id: data.coinToDelete });
				if(!playerTechnology || playerTechnology.coinsOnTechnology === 0) {
					throw new BadRequestException('u shoto pereputal');
				}
				await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 1 });
				await this.playersService.savePlayersTechnologies({ id: playerTechnology.id, coinsOnTechnology: playerTechnology.coinsOnTechnology - 1 });
				const player = await this.playersService.savePlayer({ id: loser.id, coins: loser.coins - 1 });
				return { player };
			}
			default: {
				throw new BadRequestException('pashol nahui chmo');
			}
		}
	}

	public async gainTwoTrophies(id: number, data: GainTwoTrophiesDto): Promise<GainTwoTrophiesResponse> {
		const battle = await this.battleRepository.get({ id });
		if(!battle) {
			throw new BadRequestException('you have battles in wrong order mudila');
		}
		if(battle.trophies < 2) {
			throw new BadRequestException('pupupupuuuuu');
		}
		const wantedTrophies = Object.keys(data);
		if(wantedTrophies.length > 1) {
			throw new BadRequestException('ti chmonya');
		}
		const winner = await this.playersService.getPlayer({ id: battle.winnerId });
		const loser = await this.playersService.getPlayer({ id: battle.loserId });
		switch(wantedTrophies[0]) {
			case 'technologyToSteal': {
				const technologyToSteal = await this.playersService.getPlayersTechnology({ playerId: loser.id, technologyId: data.technologyToSteal });
				if(!technologyToSteal) {
					throw new BadRequestException('u cant steal this technology');
				}
				const technology = await this.playersTechnologiesService.stealTechnology(winner, technologyToSteal.technology);
				await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 2 });
				return { technology };
			}
			case 'coinToSteal': {
				if(data.coinToSteal === 0) {
					if(loser.coinsOnList === 0) {
						throw new BadRequestException('player doesnt have coin on his list');
					}
					await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 2 });
					await this.playersService.savePlayer({ id: loser.id, coinsOnList: loser.coinsOnList - 1, coins: loser.coins - 1 })
					const player = await this.playersService.savePlayer({ id: winner.id, coinsOnList: winner.coinsOnList + 1, coins: winner.coins + 1 });
					return { player };
				}
				const playerTechnology = await this.playersService.getPlayersTechnology({ id: data.coinToSteal });
				if(!playerTechnology || playerTechnology.coinsOnTechnology === 0) {
					throw new BadRequestException('u shoto pereputal');
				}
				await this.battleRepository.save({ id: battle.id, trophies: battle.trophies - 1 });
				await this.playersService.savePlayersTechnologies({ id: playerTechnology.id, coinsOnTechnology: playerTechnology.coinsOnTechnology - 1});
				await this.playersService.savePlayer({ id: loser.id, coins: loser.coins - 1 });
				const player = await this.playersService.savePlayer({ id: winner.id, coinsOnList: winner.coinsOnList + 1, coins: winner.coins +1 });
				return { player };
			}
		}
	}

	private saveBattleTroop(troop: PlayersTroops, battleId: number): Promise<BattleTroops> {
		switch (troop.troop.type) {
			case TroopsType.Infantry:
				return this.battleTroopsRepository.save({
					troopType: TroopsType.Infantry,
					troopId: troop.id,
					attack: troop.troop.attack + troop.player.infantryLevel - 1,
					health: troop.troop.health + troop.player.infantryLevel - 1,
					playerId: troop.player.id,
					battleId,
				})
			case TroopsType.Cavalry:
				return this.battleTroopsRepository.save({
					troopType: TroopsType.Cavalry,
					troopId: troop.id,
					attack: troop.troop.attack + troop.player.cavalryLevel - 1,
					health: troop.troop.health + troop.player.cavalryLevel - 1,
					playerId: troop.player.id,
					battleId,
				})
			case TroopsType.Artillery:
				return this.battleTroopsRepository.save({
					troopType: TroopsType.Artillery,
					troopId: troop.id,
					attack: troop.troop.attack + troop.player.artilleryLevel - 1,
					health: troop.troop.health + troop.player.artilleryLevel - 1,
					playerId: troop.player.id,
					battleId,
				})
			case TroopsType.Aviation:
				return this.battleTroopsRepository.save({
					troopType: TroopsType.Aviation,
					troopId: troop.id,
					attack: troop.troop.attack,
					health: troop.troop.health,
					playerId: troop.player.id,
					battleId,
				})
			default: {
				throw new BadRequestException('wtf');
			}
		}
	}

	private async fight(firstTroop: BattleTroops, secondTroop: BattleTroops): Promise<void> {
		switch (firstTroop.troopType) {
			case TroopsType.Infantry: {
				if(secondTroop.troopType === TroopsType.Cavalry && firstTroop.attack >= secondTroop.health - secondTroop.damage) {
					await this.battleTroopsRepository.save({
						id: secondTroop.id,
						placement: -2,
					})
				}
				else if(secondTroop.troopType === TroopsType.Artillery && secondTroop.attack >= firstTroop.health - firstTroop.damage) {
					await this.battleTroopsRepository.save({
						id: firstTroop.id,
						placement: -2,
					})
				}
				else {
					await this.battleTroopsRepository.save({
						id: firstTroop.id,
						damage: firstTroop.damage + secondTroop.attack,
						placement: firstTroop.damage + secondTroop.attack >= firstTroop.health ? -2 : firstTroop.placement,
					});
					await this.battleTroopsRepository.save({
						id: secondTroop.id,
						damage: secondTroop.damage + firstTroop.attack,
						placement: secondTroop.damage + firstTroop.attack >= secondTroop.health ? -2 : secondTroop.placement,
					});
				}
				break;
			}
			case TroopsType.Cavalry: {
				if(secondTroop.troopType === TroopsType.Artillery && firstTroop.attack >= secondTroop.health - secondTroop.damage) {
					await this.battleTroopsRepository.save({
						id: secondTroop.id,
						placement: -2,
					})
				}
				else if(secondTroop.troopType === TroopsType.Infantry && secondTroop.attack >= firstTroop.health - firstTroop.damage) {
					await this.battleTroopsRepository.save({
						id: firstTroop.id,
						placement: -2,
					})
				}
				else {
					await this.battleTroopsRepository.save({
						id: firstTroop.id,
						damage: firstTroop.damage + secondTroop.attack,
						placement: firstTroop.damage + secondTroop.attack >= firstTroop.health ? -2 : firstTroop.placement,
					});
					await this.battleTroopsRepository.save({
						id: secondTroop.id,
						damage: secondTroop.damage + firstTroop.attack,
						placement: secondTroop.damage + firstTroop.attack >= secondTroop.health ? -2 : secondTroop.placement,
					});
				}
				break;
			}
			case TroopsType.Artillery: {
				if(secondTroop.troopType === TroopsType.Infantry && firstTroop.attack >= secondTroop.health - secondTroop.damage) {
					await this.battleTroopsRepository.save({
						id: secondTroop.id,
						placement: -2,
					})
				}
				else if(secondTroop.troopType === TroopsType.Cavalry && secondTroop.attack >= firstTroop.health - firstTroop.damage) {
					await this.battleTroopsRepository.save({
						id: firstTroop.id,
						placement: -2,
					})
				}
				else {
					await this.battleTroopsRepository.save({
						id: firstTroop.id,
						damage: firstTroop.damage + secondTroop.attack,
						placement: firstTroop.damage + secondTroop.attack >= firstTroop.health ? -2 : firstTroop.placement,
					});
					await this.battleTroopsRepository.save({
						id: secondTroop.id,
						damage: secondTroop.damage + firstTroop.attack,
						placement: secondTroop.damage + firstTroop.attack >= secondTroop.health ? -2 : secondTroop.placement,
					});
				}
				break;
			}
			case TroopsType.Aviation: {
				await this.battleTroopsRepository.save({
					id: firstTroop.id,
					damage: firstTroop.damage + secondTroop.attack,
					placement: firstTroop.damage + secondTroop.attack >= firstTroop.health ? -2 : firstTroop.placement,
				});
				await this.battleTroopsRepository.save({
					id: secondTroop.id,
					damage: secondTroop.damage + firstTroop.attack,
					placement: secondTroop.damage + firstTroop.attack >= secondTroop.health ? -2 : secondTroop.placement,
				});
				break;
			}
			case TroopsType.Advantage: {
				await this.battleTroopsRepository.save({
					id: firstTroop.id,
					damage: firstTroop.damage + secondTroop.attack,
					placement: firstTroop.damage + secondTroop.attack >= firstTroop.health ? -2 : firstTroop.placement,
				});
				await this.battleTroopsRepository.save({
					id: secondTroop.id,
					damage: secondTroop.damage + firstTroop.attack,
					placement: secondTroop.damage + firstTroop.attack >= secondTroop.health ? -2 : secondTroop.placement,
				});
				break;
			}
			default: {
				throw new BadRequestException('ebat ti huilush <3')
			}
		}
	}

	private async getWinnerId(battle: Battle): Promise<number> {

		const attackTroops = await this.battleTroopsRepository.getList({ playerId: battle.attackPlayer.id, battleId: battle.id });
		const defenseTroops = await this.battleTroopsRepository.getList({ playerId: battle.defensePlayer.id, battleId: battle.id });

		const aliveAttackTroops = attackTroops.filter((troop) => troop.placement >= 0);
		const aliveDefenseTroops = defenseTroops.filter((troop) => troop.placement >= 0);

		const attackHealth = aliveAttackTroops.reduce((accumulator, currentTroop) => { return accumulator + currentTroop.health - currentTroop.damage }, 0);
		const defenseHealth = aliveDefenseTroops.reduce((accumulator, currentTroop) => { return accumulator + currentTroop.health - currentTroop.damage }, 0);

		const finishedBattle = await this.battleRepository.save({
			id: battle.id,
			winnerId: attackHealth > defenseHealth ? battle.attackPlayer.id : battle.defensePlayer.id,
			loserId: attackHealth > defenseHealth ? battle.defensePlayer.id : battle.attackPlayer.id,
		});

		const deadTroops = await this.battleTroopsRepository.getList({ battleId: finishedBattle.id, placement: -2 });
		await Promise.all(deadTroops.map(deadTroop => deadTroop.troopId && this.playersService.deletePlayersTroop(deadTroop.troopId)));

		return finishedBattle.winnerId;
	}
}