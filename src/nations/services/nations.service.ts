import { Injectable } from "@nestjs/common";
import { NationsRepository } from "../repositories/nations.repository";
import { Nation } from "../dao/nation.entity";

@Injectable()
export class NationsService {
    constructor(
		private readonly nationsRepository: NationsRepository,
	) {}

    public get(id: number): Promise<Nation> {
        return this.nationsRepository.get({ id });
    } 

    public async getList(amount: number): Promise<Nation[]> {
        const nations = await this.nationsRepository.getList();
        nations.sort(() => Math.floor(Math.random() * 3 - 1));
        return nations.slice(0, amount);
    }
}