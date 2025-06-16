import { Controller, Request, Post, UseGuards, Body, Get } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { RefreshTokensDto } from './dto/RefreshTokensDto';
import { ValidateUserDto } from './dto/ValidateUserDto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(@Body() body: ValidateUserDto) {
		return this.authService.login(body);
	}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}

	@Post('refresh')
	async refresh(@Body() body: RefreshTokensDto) {
		return this.authService.refresh(body);
	}
}
