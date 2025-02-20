import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Battle } from './battle.entity';
import { Player } from 'src/player/dao/player.entity';
import { TroopsType } from 'src/enums/troops-type';

@Entity({ name: 'battle_troops' })
export class BattleTroops {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
        default: -1, //-1 - troop on players hand, -2 - troop died in battle
    })
    placement: number;

    @Column()
    troopType: TroopsType;

    @Column({
        nullable: true, // for advantage troop
    })
    troopId: number;

    @Column()
    health: number;

    @Column()
    attack: number;

    @Column({
        default: 0,
    })
    damage: number;

    @ManyToOne(() => Player)
    player: Player;

    @ManyToOne(() => Battle)
    battle: Battle;
}