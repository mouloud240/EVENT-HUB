// auth.module.ts or main.ts
import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { user } from '@prisma/client';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UsersService) {
    super();
  }

  serializeUser(user: user, done: (err: Error, id: number) => void) {
    // Serialize only the user ID into the session
    done(null,+user.id);
  }

  async deserializeUser(id: string, done: (err: Error, user: user) => void) {
    // Fetch the user from the database using the ID
    const user = await this.userService.findOne(id);
    done(null, user);
  }
}
