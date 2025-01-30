import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Resource } from "../../enums/resource"
import { Player } from "./players.entity"

@Entity({ name: "players_resources" })
export class PlayersResources {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Player)
    player: Player

    @Column()
    resourceType: Resource

    @Column()
    isOpen: boolean
}