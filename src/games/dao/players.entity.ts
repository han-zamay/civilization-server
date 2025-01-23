import { Game } from "src/games/dao/games.entity"
import { User } from "src/users/dao/users.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: "games_players" })
export class Player {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Game)
    game: Game

    @ManyToOne(() => User)
    player: User

    @Column()
    playersOrder: number

    @Column({
        default: 0,
    })
    coins: number

    @Column({
        default: 0,
    })
    tradePoints: number
}