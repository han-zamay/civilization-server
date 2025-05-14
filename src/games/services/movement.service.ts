import { Injectable, Inject, forwardRef, BadRequestException, NotFoundException, ConflictException } from "@nestjs/common";
import { Battle } from "src/battles/dao/battle.entity";
import { BattlesService } from "src/battles/services/battles.service";
import { City } from "src/city/dao/city.entity";
import { CitiesService } from "src/city/services/cities.service";
import { Landscape } from "src/enums/landscape";
import { Relict } from "src/enums/relict";
import { Cell } from "src/map/dao/cell.entity";
import { MapService } from "src/map/services/map.service";
import { PlayersFigure } from "src/player/dao/player-figure.entity";
import { PlayersService } from "src/player/services/players.service";
import { areCellsAdjust } from "src/utils/areCellsAdjust";
import { FigureMoveDto } from "../dto/figure-move.dto";

export type isPathCorrectResponse = {
	figures?: PlayersFigure[],
	startingCell?: Cell,
	targetPoint?: Cell,
	response?: boolean,
	isFigureDisbanding?: boolean,
}

export type figureMoveResponse = {
	figures?: PlayersFigure[],
	battle?: Battle,
	city?: City,
	cell?: Cell,
}

@Injectable()
export class MovementService {
	constructor(
		private readonly playersService: PlayersService,
		private readonly mapService: MapService,
		@Inject(forwardRef(() => CitiesService))
    	private citiesService: CitiesService,
        @Inject(forwardRef(() => BattlesService))
		private readonly battleService: BattlesService,		
	) {}
    public async figureMove(data: FigureMoveDto): Promise<figureMoveResponse> {
        const isPathCorrect = await this.isPathCorrect(data);
        if(!isPathCorrect.response) {
            throw new BadRequestException('invalid path');
        }
        const figures = isPathCorrect.startingCell.figures;
        const startingCell = isPathCorrect.startingCell;
        const targetPoint = isPathCorrect.targetPoint;
        console.log(startingCell.figures, startingCell);
        const remainingFigures = figures.filter((figure) => !isPathCorrect.figures.includes(figure));

        await this.mapService.saveCell({ id: startingCell.id, figures: remainingFigures, playerId: remainingFigures.length ? startingCell.player?.id : null });
        await this.mapService.saveCell({ id: targetPoint.id, figures: isPathCorrect.isFigureDisbanding ? null : figures });

        const movedFigures = await Promise.all(isPathCorrect.figures.map((figure) => this.playersService.savePlayersFigure({
            id: figure.id,
            cellId: isPathCorrect.isFigureDisbanding ? null : targetPoint.id,
            x: isPathCorrect.isFigureDisbanding ? null : targetPoint.x,
            y: isPathCorrect.isFigureDisbanding ? null : targetPoint.y,
            marchPoints: 0
        })));

        if(isPathCorrect.isFigureDisbanding) {
            const city = await this.citiesService.save({ id: targetPoint.city.id, fortificationMarker: figures[0].isArmy, caravanMarker: !figures[0].isArmy });
            return { figures: movedFigures, city };
        }
        else if(targetPoint.relict) {
            const relict = await this.findRelict(targetPoint, startingCell.player.id);
            return { figures: movedFigures, cell: relict };
        }
        else if(targetPoint.loot?.isVillage) {
            const battle = await this.battleService.fightVillage(figures, targetPoint);
            return { figures: movedFigures, battle };
        }
        else if(targetPoint.loot?.isVillage === false) {
            const cell = await this.exploreHutOrVillage(targetPoint, startingCell.player.id);
            return { figures: movedFigures, cell };
        }
        else if(targetPoint.player !== null && targetPoint.player.id !== figures[0].player.id) {
            const battle = await this.battleService.fightOpponent(figures, targetPoint);
            return { figures: movedFigures, battle };
        }
        return { figures };
    }

    public async isPathCorrect(data: FigureMoveDto): Promise<isPathCorrectResponse> {
        const figures = await Promise.all(data.figuresIds.map((figureId) => this.playersService.getPlayersFigure({ id: figureId })));
        if(!figures.length) {
            throw new NotFoundException('figures not found');
        }
        const containingScout = figures.find((figure) => !figure.isArmy);
        const startingCell = figures[0].cell;
        const player = figures[0].player;
        for(const figure of figures) {
            if(!figure?.cell) {
                throw new NotFoundException('your figure doesnt exist');
            }
            if(figure.cell.id !== startingCell?.id) {
                throw new BadRequestException('u cant move from different cells');
            }
            if(figure.player.id !== player.id) {
                throw new BadRequestException('u cant move your opponents figures');
            }
            if(figure.marchPoints < data.path.length) {
                throw new ConflictException('your figure already moved');
            }
        }
        const cellIds = data.path;

        const targetPointId = cellIds.pop();
        const targetPoint = await this.mapService.getCell({ id: targetPointId });
        let isFigureDisbanding = targetPoint.player !== null && targetPoint.player?.id === player.id && player.cities.includes(targetPoint.city);
        // console.log(isFigureDisbanding);
        if(!targetPoint || targetPoint.game.id !== player.game.id) {
            throw new NotFoundException('smth wrong with your target cell');
        }
        if(targetPoint.player !== null && targetPoint.player?.id === player.id && targetPoint.figures.length + figures.length > player.stakingLimit) {
            console.log('lalala');
            throw new ConflictException('u cant exceed staking limit');
        }
        if(isFigureDisbanding && figures.length > 1) {
            throw new BadRequestException('one by one my friend');
        }
        if(targetPoint.cell.landscape === Landscape.Water && !player.isStopingOnWater) {
            throw new ConflictException('u cant stop in water bro');
        }
        if(containingScout && (targetPoint.loot || (targetPoint.player !== null && targetPoint.player?.id !== player.id))) {
            console.log(targetPoint, (targetPoint.player?.id !== null && targetPoint.player?.id !== player.id));
            throw new ConflictException('u cant fight with scouts');
        }

        let cells = [];
        for (const cellId of cellIds) {
            const currentCell = await this.mapService.getCell({ id: cellId });
            if (!currentCell) {
                throw new NotFoundException('cell doesnt exist');
            }
            if(currentCell.game.id !== player.game.id) {
                throw new BadRequestException('u cant move figures on different games');
            }
            if(currentCell.cell.landscape === Landscape.Water && !player.isCrossingWater) {
                throw new ConflictException('maybe u should learn navigation');
            }
            if(currentCell.loot || currentCell.relict) {
                throw new ConflictException('u cant fly over things');
            }
            if(currentCell.player !== null && currentCell.player.id !== player.id) {
                throw new ConflictException('u cant pass by your opponent');
            }
            if(currentCell.figures.length + figures.length > player.stakingLimit) {
                console.log(currentCell.figures.length + figures.length, currentCell);
                throw new ConflictException('u cant exceed staking limit');
            }
            cells.push(currentCell);
        };
        cells.push(targetPoint);
        
        for(let i = 1; i < cells.length; i++) {
            let areAdjust = areCellsAdjust(cells[i - 1].x, cells[i - 1].y, cells[i].x, cells[i].y);
            if(!areAdjust) {
                throw new BadRequestException('are u charging up your path in kiosk?');
            }
        }
        return { figures, startingCell, targetPoint, isFigureDisbanding, response: true };
    }

    private async findRelict(cell: Cell, playerId: number): Promise<Cell> {
        // const cell = await this.mapService.getCell({ id: cellId });
        // if(!cell) {
        // 	throw new BadRequestException('smth wrong with your cell');
        // }
        switch(cell.relict) {
            case Relict.Ark: {
                console.log(cell.relict);
                break;
            }
            case Relict.Village: {
                console.log(cell.relict);
                break;
            }
            case Relict.Atlantis: {
                console.log(cell.relict);
                break;
            }
            case Relict.School: {
                console.log(cell.relict);
                break;
            }
            case Relict.SevenCities: {
                console.log(cell.relict);
                break;
            }
            default: {
                throw new BadRequestException('relict not working(((');
            }
        }
        return this.mapService.saveCell({ id: cell.id, relict: null, playerId });
    }

    public async exploreHutOrVillage(cell: Cell, playerId: number): Promise<Cell> {
        if(cell.loot.isImmediately) {
            throw new BadRequestException('wait for it');
        }
        else {
            await this.playersService.savePlayersResources({ playerId, resourceType: cell.loot.resource });
        }
        return this.mapService.saveCell({ id: cell.id, lootId: null, playerId });
    }
}