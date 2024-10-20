import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { GoogleStrategy } from './guards/strategies/google.Strategy';
import { SessionSerializer } from './guards/serializer';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { GithubStrategy } from './guards/strategies/github.strategy';
import { FacebookStrategy } from './guards/strategies/facebook.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtGuard,
    JwtStrategy,
    GoogleStrategy,
    SessionSerializer,
    GithubStrategy,
    FacebookStrategy,
  ],
})
export class AuthModule {}
