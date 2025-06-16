import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GamesService } from 'src/games/services/games.service';

@Injectable()
export class TurnGuard implements CanActivate {
	constructor(private readonly gamesService: GamesService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const player = request.player; // Set by GameGuard
		const game = await this.gamesService.get(player.game.id);

		if (game.activePlayerIndex !== player.playersOrder) {
			throw new ForbiddenException('Not your turn');
		}

		return true;
	}
}
