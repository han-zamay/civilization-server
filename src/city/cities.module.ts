import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitiesController } from "./cities.controller";
import { Building } from './dao/buildings.entity';
import { City } from './dao/cities.entity';
import { CitiesBuildings } from './dao/cities-buildings';
import { CitiesService } from './services/cities.service';
import { CitiesRepository } from './repositories/cities.repository';
import { CitiesBuildingsRepository } from './repositories/cities-buildings.repository';
import { BuildingsRepository } from './repositories/buildings.repository';
import { PlayersResources } from 'src/player/dao/players-resources.entity';
import { PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { PlayersTroops } from 'src/player/dao/players-troops.entity';
import { Troop } from 'src/troops/dao/troops.entity';
import { PlayersTroopsRepository } from 'src/player/repositories/players-troops.repository';
import { TroopsRepository } from 'src/troops/repositories/troops.repository';
import { Player } from 'src/player/dao/players.entity';
import { PlayersRepository } from 'src/player/repositories/players.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Building, City, CitiesBuildings, PlayersResources, Player, PlayersTroops, Troop])],
    controllers: [CitiesController],
    providers: [CitiesService, CitiesRepository, CitiesBuildingsRepository, BuildingsRepository, PlayersResourcesRepository, PlayersRepository, PlayersTroopsRepository, TroopsRepository],
})
export class CitiesModule {}