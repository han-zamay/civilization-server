import { IsDefined, IsString } from 'class-validator';

export class RefreshTokensDto {
	@IsDefined()
	@IsString()
	accessToken: string;

	@IsDefined()
	@IsString()
	refreshToken: string;
}
