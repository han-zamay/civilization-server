import { Landscape } from 'src/enums/landscape';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Building {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	hammersPrice: number;

	@Column()
	hammers: number;

	@Column()
	tradePoints: number;

	@Column()
	culturePoints: number;

	@Column()
	coins: number;

	@Column()
	advantage: number;

	@Column({
		default: false,
	})
	isSpecial: boolean;

	@Column()
	placement: Landscape;

	@Column({
		nullable: true,
	})
	description: string;
}
