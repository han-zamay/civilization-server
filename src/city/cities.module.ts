import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from './cities.controller';
import { Building } from '../games/dao/building.entity';
import { City } from './dao/city.entity';
import { CitiesBuildings } from './dao/city-building.entity';
import { CitiesService } from './services/cities.service';
import { CitiesRepository } from './repositories/cities.repository';
import { CitiesBuildingsRepository } from './repositories/cities-buildings.repository';
import { BuildingsRepository } from '../games/repositories/buildings.repository';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { PlayersTroops } from 'src/player/dao/player-troop.entity';
import { Troop } from 'src/troops/dao/troop.entity';
import { Player } from 'src/player/dao/player.entity';
import { PlayersModule } from 'src/player/players.module';
import { TroopsModule } from 'src/troops/troops.module';
import { BuildingMarket } from 'src/games/dao/building-market.entity';
import { ResourceMarket } from 'src/games/dao/resource-market.entity';
import { GamesModule } from 'src/games/games.module';
import { PlayersFigure } from 'src/player/dao/player-figure.entity';
import { Cell } from 'src/map/dao/cell.entity';
import { MapModule } from 'src/map/map.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Building,
			City,
			CitiesBuildings,
			PlayersResources,
			Player,
			PlayersTroops,
			Troop,
			BuildingMarket,
			ResourceMarket,
			PlayersFigure,
			Cell,
		]),
		PlayersModule,
		TroopsModule,
		forwardRef(() => GamesModule),
		MapModule,
	],
	controllers: [CitiesController],
	exports: [CitiesService],
	providers: [CitiesService, CitiesRepository, CitiesBuildingsRepository, BuildingsRepository],
})
export class CitiesModule {}
