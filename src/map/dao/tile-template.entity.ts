import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tile_template' })
export class TileTemplate {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'jsonb',
	})
	cells: number[][];

	@Column({
		default: false,
	})
	isNationTile: boolean;
}
