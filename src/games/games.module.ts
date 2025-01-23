import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './dao/games.entity';
import { GamesController } from './games.controller';
import { GamesService } from './services/games.service';
import { GamesRepository } from './repositories/games.repository';
import { PlayersRepository } from './repositories/players.repository';
import { Player } from './dao/players.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/dao/users.entity';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Game, Player, User]), UsersModule],
    controllers: [GamesController],
    providers: [GamesService, GamesRepository, PlayersRepository, UsersRepository],
})
export class GamesModule {}