import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Troop } from './dao/troop.entity';
import { TroopsService } from './troops.service';
import { TroopsRepository } from './repositories/troops.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Troop])],
	providers: [TroopsService, TroopsRepository],
	exports: [TroopsService],
})
export class TroopsModule {}
