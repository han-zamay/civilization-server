import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './dao/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	exports: [UsersService],
	providers: [UsersService, UsersRepository],
})
export class UsersModule {}
