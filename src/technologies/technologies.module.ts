import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersTechnologiesController } from './players-technologies.controller';
import { PlayersTechnologies } from './dao/player-technology.entity';
import { PlayersTechnologiesService } from './services/players-technologies.service';
import { PlayersTechnologiesRepository } from './repositories/players-technologies.repository';
import { PlayersModule } from 'src/player/players.module';

@Module({
	imports: [TypeOrmModule.forFeature([PlayersTechnologies]), PlayersModule],
	controllers: [PlayersTechnologiesController],
	providers: [PlayersTechnologiesService, PlayersTechnologiesRepository],
	exports: [PlayersTechnologiesService],
})
export class TechnologiesModule {}
