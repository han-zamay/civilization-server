import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Cell } from 'src/map/dao/cell.entity';

@Entity({ name: 'players_figures' })
export class PlayersFigure {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Player)
	player: Player;

    @Column()
    isArmy: boolean;

    @ManyToOne(() => Cell)
    cell: Cell

    @Column({
        default: null,
    })
    x: number;

    @Column({
        default: null,
    })
    y: number;

    @Column({
        default: 0,
    })
    marchPoints: number;
}