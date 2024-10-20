import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserDetails } from 'src/user/interfaces/user-details.interface';


import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: UserDetails, done: Function) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: Function) {
    try {
      const user = await this.userService.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
}
