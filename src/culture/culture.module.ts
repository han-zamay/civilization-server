import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultureController } from './culture.controller';
import { CardInGame } from './dao/card-in-game.entity';
import { CardInGameRepository } from './repositories/card-in-game.repository';
import { CultureCardService } from './services/culture-card.service';
import { PlayersModule } from 'src/player/players.module';

@Module({
	imports: [TypeOrmModule.forFeature([CardInGame]), PlayersModule],
	controllers: [CultureController],
	exports: [CultureCardService],
	providers: [CultureCardService, CardInGameRepository],
})
export class CultureModule {}
