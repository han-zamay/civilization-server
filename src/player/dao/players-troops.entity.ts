import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Player } from "./players.entity";
import { Troop } from "src/troops/dao/troops.entity";

@Entity({ name: "players-troops" })
export class PlayersTroops {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Player)
    player: Player

    @ManyToOne(() => Troop)
    troop: Troop
}