import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './games/dao/games.entity';
import { GamesModule } from './games/games.module';
import { UsersModule } from './users/users.module';
import { User } from './users/dao/users.entity';
import { TechnologiesModule } from './technologies/technologies.module';
import { Technology } from './technologies/dao/technology.entity';
import { PlayersTechnologies } from './technologies/dao/players-technologies.entity';
import { Player } from './games/dao/players.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123123',
            database: 'postgres',
            entities: [Game, User, Technology, PlayersTechnologies, Player],
            synchronize: true,
        }),
        GamesModule,
        UsersModule,
        TechnologiesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
