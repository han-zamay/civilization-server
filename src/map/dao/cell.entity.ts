import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CellTemplate } from './cell-template.entity';
import { Player } from 'src/player/dao/player.entity';
import { City } from 'src/city/dao/city.entity';
import { Relict } from 'src/enums/relict';
import { Loot } from 'src/games/dao/loot.entity';
import { Game } from 'src/games/dao/game.entity';

@Entity()
export class Cell {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => CellTemplate)
    cell: CellTemplate;

    @ManyToOne(() => City)
    city: City;

    @Column({
        default: 0,
    })
    armyCount: number;

    @Column({
        default: 0,
    })
    scoutCount: number;

    @ManyToOne(() => Loot)
    loot: Loot;

    @Column({
        default: null,
    })
    relict: Relict;

    @ManyToOne(() => Player)
    player: Player;

    @ManyToOne(() => Game)
    game: Game;

    @Column({
        nullable: true,
    })
    x: number;

    @Column({
        nullable: true,
    })
    y: number;
}