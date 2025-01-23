import { Game } from "src/games/dao/games.entity"
import { User } from "src/users/dao/users.entity"
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Technology } from "./technology.entity"

@Entity({ name: "players_technologies" })
export class PlayersTechnologies {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User)
    player: User

    @ManyToOne(() => Game)
    game: Game

    @ManyToOne(() => Technology)
    technology: Technology
}