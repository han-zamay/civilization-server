import { Landscape } from 'src/enums/landscape';
import { Relict } from 'src/enums/relict';
import { Resource } from 'src/enums/resource';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cell_template' })
export class CellTemplate {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
        default: 0,
    })
    hammers: number;

    @Column({
        default: 0,
    })
    tradePoints: number;

    @Column({
        default: 0,
    })
    culturePoints: number;

    @Column({
        default: false,
    })
    coin: boolean;

    @Column({
        default: null,
        nullable: true,
    })
    resource: Resource;

    @Column({
        default: false,
    })
    hutMarker: boolean;

    @Column({
        default: false,
    })
    villageMarker: boolean;

    @Column({
        default: null,
    })
    relict: Relict;

    @Column()
    landscape: Landscape;
}