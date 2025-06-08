import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/services/users.service';
import { ValidateUserDto } from 'src/users/dto/ValidateUserDto';
import { User } from 'src/users/dao/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'username',
      passwordField: 'password'
    });
  }

  async validate(username: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.validateUser({ username, password, dummyProperty: true });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}