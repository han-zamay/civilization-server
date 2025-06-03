import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersResources } from 'src/player/dao/player-resource.entity';
import { PlayersResourcesRepository } from 'src/player/repositories/players-resources.repository';
import { Player } from './dao/player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './services/players.service';
import { PlayersRepository } from './repositories/players.repository';
import { PlayersTroops } from './dao/player-troop.entity';
import { PlayersTroopsRepository } from './repositories/players-troops.repository';
import { PlayersFigure } from './dao/player-figure.entity';
import { PlayersFiguresRepository } from './repositories/players-figures.repository';
import { Nation } from 'src/nations/dao/nation.entity';
import { NationsModule } from 'src/nations/nations.module';

@Module({
	imports: [TypeOrmModule.forFeature([Player, PlayersResources, PlayersTroops, PlayersFigure, Nation]), NationsModule],
	controllers: [PlayersController],
	exports: [PlayersService],
	providers: [
		PlayersService,
		PlayersRepository,
		PlayersResourcesRepository,
		PlayersTroopsRepository,
		PlayersFiguresRepository,
	],
})
export class PlayersModule {}
