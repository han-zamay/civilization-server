import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AuthResponse, UsersService } from './services/users.service';
import { User } from './dao/user.entity';
import { SaveUserDto } from './dto/SaveUserDto';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get(':id')
	get(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
		return this.usersService.get({ id });
	}

	@Post()
	save(@Body() body: SaveUserDto): Promise<AuthResponse> {
		return this.usersService.save(body);
	}
}
