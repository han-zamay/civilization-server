import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games/dao/game.entity';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { User } from './users/dao/user.entity';
import { TechnologiesModule } from './technologies/technologies.module';
import { Technology } from './technologies/dao/technology.entity';
import { PlayersTechnologies } from './player/dao/player-technology.entity';
import { Player } from './player/dao/player.entity';
import { PlayersResources } from './player/dao/player-resource.entity';
import { City } from './city/dao/city.entity';
import { Building } from './games/dao/building.entity';
import { CitiesBuildings } from './city/dao/city-building.entity';
import { CitiesModule } from './city/cities.module';
import { PlayersModule } from './player/players.module';
import { Troop } from './troops/dao/troop.entity';
import { PlayersTroops } from './player/dao/player-troop.entity';
import { Battle } from './battles/dao/battle.entity';
import { BattleTroops } from './battles/dao/battle-troops.entity';
import { BattlesModule } from './battles/batttles.module';
import { BuildingMarket } from './games/dao/building-market';
import { ResourceMarket } from './games/dao/resource-market';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: '123123',
			database: 'postgres',
			entities: [Game, User, Technology, PlayersTechnologies, Player, PlayersResources, City, Building, CitiesBuildings, Troop, PlayersTroops, Battle, BattleTroops, BuildingMarket, ResourceMarket],
			synchronize: true,
		}),
		GamesModule,
		UsersModule,
		TechnologiesModule,
		CitiesModule,
		PlayersModule,
		BattlesModule,
	],
})
export class AppModule {}
