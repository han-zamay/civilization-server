import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from 'src/games/dao/game.entity';
import { Player } from 'src/player/dao/player.entity';
import { CultureCard } from 'src/enums/cultureCard';

@Entity()
export class CardInGame {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: CultureCard;

    @ManyToOne(() => Game)
	@Index()
    game: Game;

	@ManyToOne(() => Player, { nullable: true })
	player?: Player;

	@Column({
		default: false,
	})
    isUsed: boolean;
}