import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PlayersService } from 'src/player/services/players.service';

@Injectable()
export class GameGuard implements CanActivate {
	constructor(private readonly playersService: PlayersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		if (!user) {
			throw new UnauthorizedException('User not authenticated');
		}

		const player = await this.playersService.getPlayers({
			userId: user.userId,
			gameId: request.params.gameId,
		});
		if (!player) {
			throw new UnauthorizedException('User is not in this game');
		}
		request.player = player;
		return true;
	}
}
