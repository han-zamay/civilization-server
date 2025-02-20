import { City } from 'src/city/dao/city.entity';
import { Game } from 'src/games/dao/game.entity';
import { User } from 'src/users/dao/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Player {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Game, (game) => game.players)
	game: Game;

	@ManyToOne(() => User)
	user: User;

	@Column()
	playersOrder: number;

	@Column({
		default: 0,
	})
	coins: number;

	@Column({
		default: 0,
	})
	tradePoints: number;

	@Column({
		default: 0,
	})
	culturePoints: number;

	@Column({
		default: 0,
	})
	advantage: number;

	@Column({
		default: 1,
	})
	infantryLevel: number;

	@Column({
		default: 1,
	})
	cavalryLevel: number;

	@Column({
		default: 1,
	})
	artilleryLevel: number;

	@Column({
		default: false,
	})
	aviation: boolean;

	@OneToMany(() => City, (city) => city.player)
	cities: City[];

	@Column({
		default: 2,
	})
	citiesLimit: number;

	@Column({
		default: 0,
	})
	coinsOnList: number;
}
