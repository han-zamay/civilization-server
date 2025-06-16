import { Cell } from 'src/map/dao/cell.entity';
import { Player } from 'src/player/dao/player.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Battle {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Player)
	attackPlayer: Player;

	@ManyToOne(() => Player)
	defensePlayer: Player;

	@ManyToOne(() => Cell)
	cell: Cell;

	@Column({
		default: false,
	})
	isAttackTurn: boolean;

	@Column({
		nullable: true,
	})
	winnerId: number;

	@Column({
		nullable: true,
	})
	loserId: number;

	@Column({
		default: 0,
	})
	trophies: number;
}
