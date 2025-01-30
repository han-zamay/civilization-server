import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./cities.entity";
import { Building } from "./buildings.entity";

@Entity({ name: "cities-buildings" })
export class CitiesBuildings {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => City)
    city: City

    @ManyToOne(() => Building)
    building: Building
}