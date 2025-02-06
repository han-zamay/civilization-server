import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { User } from './dao/user.entity';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get(':id')
	get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
		return this.usersService.get(id);
	}

	@Post()
	save(@Body() body): Promise<User> {
		return this.usersService.save(body);
	}
}
