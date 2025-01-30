import { Resource } from "src/enums/resource";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class City {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    playerId: number

    @Column()
    hammers: number

    @Column()
    tradePoints: number

    @Column()
    culturePoints: number

    @Column({
        type: 'jsonb',
        nullable: true
    })
    possibleResources: Resource[]

    @Column()
    action: boolean

    @Column({
        default: false
    })
    havingSpecialBuilding: boolean
}