import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './dao/game.entity';
import { GamesController } from './games.controller';
import { GamesService } from './services/games.service';
import { GamesRepository } from './repositories/games.repository';
import { Player } from '../player/dao/player.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/dao/user.entity';
import { PlayersModule } from 'src/player/players.module';

@Module({
	imports: [TypeOrmModule.forFeature([Game, Player, User]), UsersModule, PlayersModule],
	controllers: [GamesController],
	exports: [GamesService],
	providers: [GamesService, GamesRepository],
})
export class GamesModule {}
