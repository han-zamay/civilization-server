import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Technology } from "../../technologies/dao/technology.entity"
import { Player } from "src/player/dao/players.entity"

@Entity({ name: "players_technologies" })
export class PlayersTechnologies {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Player)
    player: Player

    @ManyToOne(() => Technology)
    technology: Technology
}