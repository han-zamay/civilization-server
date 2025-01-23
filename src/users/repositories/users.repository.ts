import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../dao/users.entity';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>,
    ) {}

    public async getUser(id?: number): Promise<User> {
        const user = this.repository.findOne({
            where: {
                id,
            },
        });
        return user;
    }

    public save(data: Partial<User>): Promise<User> {
        return this.repository.save(data);
    }
}