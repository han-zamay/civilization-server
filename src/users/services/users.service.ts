import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../dao/user.entity';
import * as bcrypt from 'bcrypt';
import { ValidateUserDto } from '../dto/ValidateUserDto';

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	public get(id: number): Promise<User> {
		return this.usersRepository.get({ id });
	}

	public async validateUser(data: ValidateUserDto): Promise<Omit<User, 'password'>> {
        console.log(data);
        const user = await this.usersRepository.get({ email: data.email, username: data.username });
        console.log(user, data.password, user.password);
        const isMatch = bcrypt.compareSync(data.password, user.password);
        if (user && isMatch) {
			const { password, ...result } = user;
            return result;
        }
        return null;
    }

	public async save(data: Partial<User>): Promise<User> {
		const hashedPassword = await bcrypt.hash(data.password, 10);
        const newUser = { ...data, password: hashedPassword as string };
        return this.usersRepository.save(newUser);
	}
}
