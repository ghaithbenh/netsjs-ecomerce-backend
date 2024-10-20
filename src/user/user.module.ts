// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './shemas/user.Schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import { SessionSerializer } from 'src/auth/guards/serializer';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { FacebookStrategy } from 'src/auth/guards/strategies/facebook.strategy';
import { GithubStrategy } from 'src/auth/guards/strategies/github.strategy';
import { GoogleStrategy } from 'src/auth/guards/strategies/google.Strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy, SessionSerializer, AuthService, JwtService,GithubStrategy,FacebookStrategy],
  exports: [UserService],
})
export class UserModule {}
