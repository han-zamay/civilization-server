import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersResources } from 'src/player/dao/players-resources.entity';
import { PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { Player } from './dao/players.entity';
import { PlayersTechnologies } from './dao/players-technologies.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './services/players.service';
import { PlayersTechnologiesRepository } from './repositories/players-technologies.repository';
import { PlayersRepository } from './repositories/players.repository';
import { PlayersTroops } from './dao/players-troops.entity';
import { PlayersTroopsRepository } from './repositories/players-troops.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Player, PlayersTechnologies, PlayersResources, PlayersTroops])],
    controllers: [PlayersController],
    providers: [PlayersService, PlayersRepository, PlayersTechnologiesRepository, PlayersResourcesRepository, PlayersTroopsRepository],
})
export class PlayersModule {}