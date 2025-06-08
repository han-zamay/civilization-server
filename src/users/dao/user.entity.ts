import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: true,
	})
	username: string;

	@Column({
		// unique: true,
		nullable: true,
	})
	email: string;

	@Column({
		nullable: true,
	})
	password: string;
}
