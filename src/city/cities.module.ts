import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from './cities.controller';
import { Building } from './dao/building.entity';
import { City } from './dao/city.entity';
import { CitiesBuildings } from './dao/city-building.entity';
import { CitiesService } from './services/cities.service';
import { CitiesRepository } from './repositories/cities.repository';
import { CitiesBuildingsRepository } from './repositories/cities-buildings.repository';
import { BuildingsRepository } from './repositories/buildings.repository';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { PlayersTroops } from 'src/player/dao/player-troop.entity';
import { Troop } from 'src/troops/dao/troop.entity';
import { Player } from 'src/player/dao/player.entity';
import { PlayersModule } from 'src/player/players.module';
import { TroopsModule } from 'src/troops/troops.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Building, City, CitiesBuildings, PlayersResources, Player, PlayersTroops, Troop]),
		PlayersModule,
		TroopsModule,
	],
	controllers: [CitiesController],
	exports: [CitiesService],
	providers: [CitiesService, CitiesRepository, CitiesBuildingsRepository, BuildingsRepository],
})
export class CitiesModule {}
