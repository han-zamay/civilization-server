import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { Building } from '../../games/dao/building.entity';

@Entity({ name: 'city_building' })
export class CitiesBuildings {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => City)
	city: City;

	@ManyToOne(() => Building)
	building: Building;
}
