import { Fase } from 'src/enums/fase';
import { Resource } from 'src/enums/resource';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Technology {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	level: number;

	@Column({
		default: false,
	})
	baseCoin: boolean;

	@Column({
		nullable: true,
	})
	description: string;

	@Column({
		default: false,
	})
	isAction: boolean;

	@Column({
		nullable: true,
	})
	faseOfAction: Fase;

	@Column({
		type: 'jsonb',
		nullable: true,
	})
	resources: Resource[];
}
