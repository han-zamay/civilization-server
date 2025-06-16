import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from 'src/enums/resource';

@Entity()
export class Loot {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		default: false,
	})
	isVillage: boolean;

	@Column()
	resource: Resource;

	@Column({
		default: false,
	})
	isImmediately: boolean;
}
