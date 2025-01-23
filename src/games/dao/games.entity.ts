import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Fase } from "../enums/fase"
import { User } from "src/users/dao/users.entity"

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: 1,
    })
    turn: number

    @Column({
        default: Fase.Start,
    })
    fase: Fase

    @Column({
        default: 1,
    })
    activePlayerIndex: number

    @Column({
        default: 4,
    })
    playersCount: number

}