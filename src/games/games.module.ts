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
import { BuildingMarket } from './dao/building-market.entity';
import { ResourceMarket } from './dao/resource-market.entity';
import { BuildingMarketRepository } from './repositories/building-market.repository';
import { ResourceMarketRepository } from './repositories/resource-market.repository';
import { BuildingsRepository } from './repositories/buildings.repository';
import { Cell } from 'src/map/dao/cell.entity';
import { CellTemplate } from 'src/map/dao/cell-template.entity';
import { TileTemplate } from 'src/map/dao/tile-template.entity';
import { MapModule } from 'src/map/map.module';
import { PlayersFigure } from 'src/player/dao/player-figure.entity';
import { Nation } from 'src/nations/dao/nation.entity';
import { NationsModule } from 'src/nations/nations.module';
import { LootRepository } from './repositories/loot.repository';
import { Loot } from './dao/loot.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Game, Player, User, Building, BuildingMarket, ResourceMarket, Cell, CellTemplate, TileTemplate, PlayersFigure, Nation, Loot]), UsersModule, PlayersModule, TroopsModule, MapModule, NationsModule],
	controllers: [GamesController],
	exports: [GamesService],
	providers: [GamesService, GamesRepository, BuildingMarketRepository, ResourceMarketRepository, BuildingsRepository, LootRepository],
})
export class GamesModule {}
