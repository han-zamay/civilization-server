import { Resource } from 'src/enums/resource';
import { Game } from 'src/games/dao/game.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResourceMarket {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Game)
	game: Game;

	@Column()
	resource: Resource;

	@Column()
	amount: number;
}
