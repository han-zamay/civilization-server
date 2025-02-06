import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { Player } from './dao/player.entity';
import { PlayersTechnologies } from './dao/player-technology.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './services/players.service';
import { PlayersTechnologiesRepository } from './repositories/players-technologies.repository';
import { PlayersRepository } from './repositories/players.repository';
import { PlayersTroops } from './dao/player-troop.entity';
import { PlayersTroopsRepository } from './repositories/players-troops.repository';
import { TechnologiesModule } from 'src/technologies/technologies.module';
import { PlayersTechnologiesController } from './players-technologies.controller';
import { PlayersTechnologiesService } from './services/players-technologies.service';

@Module({
	imports: [TypeOrmModule.forFeature([Player, PlayersTechnologies, PlayersResources, PlayersTroops]), TechnologiesModule],
	controllers: [PlayersController, PlayersTechnologiesController],
	exports: [PlayersService, PlayersTechnologiesService],
	providers: [
		PlayersService,
		PlayersTechnologiesService,
		PlayersRepository,
		PlayersTechnologiesRepository,
		PlayersResourcesRepository,
		PlayersTroopsRepository,
	],
})
export class PlayersModule {}
