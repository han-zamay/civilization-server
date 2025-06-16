import { Game } from 'src/games/dao/game.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Building } from './building.entity';

@Entity()
export class BuildingMarket {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Game)
	game: Game;

	@ManyToOne(() => Building)
	building: Building;

	@Column()
	amount: number;
}
