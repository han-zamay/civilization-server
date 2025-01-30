import { Controller } from "@nestjs/common";
import { PlayersService } from "./services/players.service";

@Controller('players')
export class PlayersController {
    constructor(private readonly playersService: PlayersService) {}

    // @Get()
    // build(@Query() query): Promise<CitiesBuildings> {
    //     return this.citiesService.build(query);
    // }

    // @Post()
    // gainResource(@Body() body: GainResourceDto): Promise<PlayersResources> {
    //     return this.citiesService.gainResource(body);
    // }

}