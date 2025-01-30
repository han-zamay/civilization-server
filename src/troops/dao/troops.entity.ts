import { TroopsType } from "src/enums/troopsType";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Troop {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: TroopsType

    @Column()
    attack: number

    @Column()
    health: number
}