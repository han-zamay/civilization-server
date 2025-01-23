import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './dao/technology.entity';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './services/technologies.service';
import { TechnologiesRepository } from './repositories/technologies.repository';
import { PlayersTechnologiesRepository } from './repositories/players-technologies.repository';
import { PlayersTechnologies } from './dao/players-technologies.entity';
import { GamesModule } from 'src/games/games.module';
import { Player } from 'src/games/dao/players.entity';
import { PlayersRepository } from 'src/games/repositories/players.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Technology, PlayersTechnologies, Player]), GamesModule],
    controllers: [TechnologiesController],
    providers: [TechnologiesService, TechnologiesRepository, PlayersTechnologiesRepository, PlayersRepository],
    exports: [TechnologiesService, TechnologiesRepository, PlayersTechnologiesRepository],
})
export class TechnologiesModule {}