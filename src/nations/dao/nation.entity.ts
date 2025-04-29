import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Nation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	tileId: number;

	@Column({
		nullable: true,
	})
	description: string;
}
