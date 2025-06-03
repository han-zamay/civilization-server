import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from 'src/player/dao/player.entity';
import { Technology } from 'src/enums/technology';

@Entity({ name: 'players_technologies' })
export class PlayersTechnologies {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Player)
	player: Player;

	@Column()
	technology: Technology;

	@Column({
		default: 0,
	})
	coinsOnTechnology: number;
}
