import { Resource } from 'src/enums/resource';
import { Player } from 'src/player/dao/player.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class City {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		default: false,
	})
	isCapital: boolean;

	@Column({
		default: null,
	})
	x: number;

	@Column({
		default: null,
	})
	y: number;

	@Column()
	hammers: number;

	@Column()
	tradePoints: number;

	@Column()
	culturePoints: number;

	@Column({
		default: 0,
	})
	advantage: number;

	@Column({
		type: 'jsonb',
		nullable: true,
	})
	possibleResources: Resource[];

	@Column({
		default: true,
	})
	action: boolean;

	@Column({
		default: false,
	})
	havingSpecialBuilding: boolean;

	@Column({
		default: false,
	})
	havingWonder: boolean;

	@ManyToOne(() => Player, (player) => player.cities)
	player: Player;

	@Column({
		default: 6,
	})
	defense: number;

	@Column({
		default: false,
	})
	havingWalls: boolean;
}
