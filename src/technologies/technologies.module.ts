import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Technology } from './dao/technology.entity';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './services/technologies.service';
import { TechnologiesRepository } from './repositories/technologies.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Technology])],
	controllers: [TechnologiesController],
	providers: [TechnologiesService, TechnologiesRepository],
	exports: [TechnologiesService],
})
export class TechnologiesModule {}
