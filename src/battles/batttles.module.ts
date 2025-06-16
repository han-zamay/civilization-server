import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesModule } from 'src/games/games.module';
import { BattlesController } from './battles.controller';
import { BattlesService } from './services/battles.service';
import { CitiesModule } from 'src/city/cities.module';
import { City } from 'src/city/dao/city.entity';
import { Game } from 'src/games/dao/game.entity';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { PlayersTroops } from 'src/player/dao/player-troop.entity';
import { Player } from 'src/player/dao/player.entity';
import { PlayersModule } from 'src/player/players.module';
import { Troop } from 'src/troops/dao/troop.entity';
import { TroopsModule } from 'src/troops/troops.module';
import { Battle } from './dao/battle.entity';
import { BattleTroops } from './dao/battle-troops.entity';
import { BattleRepository } from './repositories/battle.repository';
import { BattleTroopsRepository } from './repositories/battle-troops.repository';
import { MapModule } from 'src/map/map.module';
import { Cell } from 'src/map/dao/cell.entity';
import { TechnologiesModule } from 'src/technologies/technologies.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([PlayersResources, Player, PlayersTroops, Troop, Game, City, Battle, BattleTroops, Cell]),
		PlayersModule,
		TechnologiesModule,
		TroopsModule,
		CitiesModule,
		MapModule,
		forwardRef(() => GamesModule),
	],
	exports: [BattlesService],
	controllers: [BattlesController],
	providers: [BattlesService, BattleRepository, BattleTroopsRepository],
})
export class BattlesModule {}
