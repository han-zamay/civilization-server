import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Fase } from '../../enums/fase';

@Entity()
export class Game {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		default: 1,
	})
	turn: number;

	@Column({
		default: Fase.Start,
	})
	fase: Fase;

	@Column({
		default: 1,
	})
	activePlayerIndex: number;

	@Column({
		default: 4,
	})
	playersCount: number;
}
