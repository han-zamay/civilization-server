import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Troop } from 'src/troops/dao/troop.entity';

@Entity({ name: 'players_troops' })
export class PlayersTroops {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Player)
	player: Player;

	@ManyToOne(() => Troop)
	troop: Troop;
}
