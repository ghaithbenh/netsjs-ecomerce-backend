import { UserService } from './user.service';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserDetails } from './interfaces/user-details.interface';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @UseGuards(JwtGuard)
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }
}