import { Injectable } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { User } from "../dao/users.entity";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    public async getUser(query: { userId?: number }): Promise<User> {
        const user = await this.usersRepository.getUser(query.userId);

        return user;
    }

    public save(data: Partial<User>): Promise<User> {
        return this.usersRepository.save(data);
    }
}