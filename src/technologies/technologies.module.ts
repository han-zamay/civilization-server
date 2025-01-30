import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './dao/technology.entity';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './services/technologies.service';
import { TechnologiesRepository } from './repositories/technologies.repository';
import { PlayersTechnologiesRepository } from '../player/repositories/players-technologies.repository';
import { PlayersTechnologies } from '../player/dao/players-technologies.entity';
import { GamesModule } from 'src/games/games.module';
import { Player } from 'src/player/dao/players.entity';
import { PlayersRepository } from 'src/player/repositories/players.repository';
import { PlayersResources } from 'src/player/dao/players-resources.entity';
import { PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { TechnologiesActionsService } from './services/technologiesActions.servise';

@Module({
    imports: [TypeOrmModule.forFeature([Technology, PlayersTechnologies, Player, PlayersResources]), GamesModule],
    controllers: [TechnologiesController],
    providers: [TechnologiesService, TechnologiesActionsService, TechnologiesRepository, PlayersTechnologiesRepository, PlayersRepository, PlayersResourcesRepository],
    exports: [TechnologiesService, TechnologiesRepository, PlayersTechnologiesRepository],
})
export class TechnologiesModule {}