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
import { TroopsModule } from 'src/troops/troops.module';
import { Building } from 'src/games/dao/building.entity';
import { BuildingMarket } from './dao/building-market';
import { ResourceMarket } from './dao/resource-market';
import { BuildingMarketRepository } from './repositories/building-market.repository';
import { ResourceMarketRepository } from './repositories/resource-market.repository';
import { BuildingsRepository } from './repositories/buildings.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Game, Player, User, Building, BuildingMarket, ResourceMarket]), UsersModule, PlayersModule, TroopsModule],
	controllers: [GamesController],
	exports: [GamesService],
	providers: [GamesService, GamesRepository, BuildingMarketRepository, ResourceMarketRepository, BuildingsRepository],
})
export class GamesModule {}
