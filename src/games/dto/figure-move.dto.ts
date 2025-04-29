import { IsArray, IsDefined, IsNumber } from 'class-validator';

export class FigureMoveDto {
	@IsDefined()
    @IsNumber(undefined, { each: true })
	@IsArray()
	path: number[];

	@IsDefined()
    @IsNumber(undefined, { each: true })
	@IsArray()
	figuresIds: number[];
}