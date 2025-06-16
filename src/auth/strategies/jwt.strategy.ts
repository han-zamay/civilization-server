import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

export interface GameJwtPayload {
	sub: number;
	iat?: number;
	exp?: number;

	username: string;
	email?: string;

	gameContext?: {
		playerId: number;
		gameId: number;
		playersOrder: number;
	};
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_ACCESS_SECRET,
		});
	}

	async validate(payload: GameJwtPayload) {
		return {
			userId: payload.sub,
			username: payload.username,
			gameContext: payload.gameContext,
		};
	}
}
