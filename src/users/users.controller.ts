import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { User } from './dao/users.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    get(@Query() query): Promise<User> {
        return this.usersService.getUser(query);
    }

    @Post()
    save(@Body() body): Promise<User> {
        return this.usersService.save(body);
    }
}