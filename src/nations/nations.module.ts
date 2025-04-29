import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nation } from './dao/nation.entity';
import { NationsRepository } from './repositories/nations.repository';
import { NationsService } from './services/nations.service';

@Module({
	imports: [TypeOrmModule.forFeature([Nation])],
	providers: [NationsService, NationsRepository],
	exports: [NationsService],
})
export class NationsModule {}