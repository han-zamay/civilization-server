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
import { PlayersTechnologies } from './player/dao/players-technologies.entity';
import { Player } from './player/dao/players.entity';
import { PlayersResources } from './player/dao/players-resources.entity';
import { City } from './city/dao/cities.entity';
import { Building } from './city/dao/buildings.entity';
import { CitiesBuildings } from './city/dao/cities-buildings';
import { CitiesModule } from './city/cities.module';
import { PlayersModule } from './player/players.module';
import { Troop } from './troops/dao/troops.entity';
import { PlayersTroops } from './player/dao/players-troops.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: '123123',
            database: 'postgres',
            entities: [Game, User, Technology, PlayersTechnologies, Player, PlayersResources, City, Building, CitiesBuildings, Troop, PlayersTroops],
            synchronize: true,
        }),
        GamesModule,
        UsersModule,
        TechnologiesModule,
        CitiesModule,
        PlayersModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
