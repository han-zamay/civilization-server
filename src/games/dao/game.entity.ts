import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Fase } from '../../enums/fase';
import { Player } from 'src/player/dao/player.entity';

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

	@Column({
		type: 'jsonb',
		nullable: true,
	})
	tiles: number[][];

	@Column({
		type: 'jsonb',
		nullable: true,
	})
	map: number[][]; // cellIds, null - tile closed, -1 - blocked cell(for 2-3 players)

	@OneToMany(() => Player, (player) => player.game)
	players: Player[];
}
