import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Technology {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    level: number

    @Column({
        default: false,
    })
    baseCoin: boolean

    @Column({
        nullable: true,
    })
    description: string
}