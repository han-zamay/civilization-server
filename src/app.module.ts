import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games/dao/game.entity';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { User } from './users/dao/user.entity';
import { TechnologiesModule } from './technologies/technologies.module';
import { PlayersTechnologies } from './technologies/dao/player-technology.entity';
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
import { BuildingMarket } from './games/dao/building-market.entity';
import { ResourceMarket } from './games/dao/resource-market.entity';
import { Cell } from './map/dao/cell.entity';
import { CellTemplate } from './map/dao/cell-template.entity';
import { TileTemplate } from './map/dao/tile-template.entity';
import { MapModule } from './map/map.module';
import { NationsModule } from './nations/nations.module';
import { Nation } from './nations/dao/nation.entity';
import { PlayersFigure } from './player/dao/player-figure.entity';
import { Loot } from './games/dao/loot.entity';
import { CardInGame } from './culture/dao/card-in-game.entity';
import { CultureModule } from './culture/culture.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: '123123',
			database: 'civilization',
			entities: [Game, User, PlayersTechnologies, Player, PlayersResources, City, Building, CitiesBuildings, Troop, PlayersTroops, Battle, BattleTroops, BuildingMarket, ResourceMarket, Cell, CellTemplate, TileTemplate, Nation, PlayersFigure, Loot, CardInGame],
			synchronize: true,
		}),
		GamesModule,
		UsersModule,
		TechnologiesModule,
		CitiesModule,
		PlayersModule,
		BattlesModule,
		MapModule,
		NationsModule,
		CultureModule,
		AuthModule,
	],
})
export class AppModule {}
