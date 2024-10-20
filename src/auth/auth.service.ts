import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';


import { Strategy as GithubStrategyy, Profile as GithubProfile, } from 'passport-github';


import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { NewUserDto } from 'src/user/dtos/new-user.dto';
import { UserDetails } from 'src/user/interfaces/user-details.interface';
import { ExistingUserDto } from 'src/user/dtos/existing-user.dto';
import { UserDetails2 } from 'src/user/interfaces/user-details2.interface';


@Injectable()
export class AuthService {
  constructor(  
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: Readonly<NewUserDto>): Promise<any> {
    const { name, email, password } = user;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) return 'Email Taken!';
    const hashedPassword = await this.hashedPassword(password);
    const newUser = await this.userService.create(name, email, hashedPassword);
    return this.userService._getUserDetails(newUser);
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const doesUserExist = !!user;

    if (!doesUserExist) return null;

    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;
    return this.userService._getUserDetails(user);
  }

  async validateUser2(details: UserDetails2): Promise<any> {
   console.log(`Validating or creating user with email: ${details.email}`);
    const user = await this.userService.findByEmail(details.email);

    if (user) {
      console.log(`User found: ${details.email}`);
      return user;
    } else {
      console.log(`User not found. Creating new user: ${details.email}`);
      const newUser = await this.userService.create2(details.email, details.name);
      console.log(`New user created: ${details.email}`);
      return newUser;
    }
  }

  async login(
    existingUser: ExistingUserDto,
  ): Promise<{ token: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) {
      const userDetails2: UserDetails2 = {
        email: existingUser.email,
        name: '', // Populate the name field as needed
      };
      const newUser = await this.validateUser2(userDetails2);
      console.log({newUser});
      
      if (!newUser) return null;
      const jwt = await this.jwtService.signAsync({ user: newUser });
      return { token: jwt };
    }

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    try {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);

      const userDetails2: UserDetails2 = {
        email: profile.emails[0].value,
        name: profile.displayName || '',
        password:"aaa",
       
      };

      const user = await this.validateUser2(userDetails2);
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth validation error:', err);
      return done(err, false);
    }
  }

  // Configure Google OAuth strategy
  configureGoogleStrategy(): Strategy {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const googleClientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    const callbackURL = this.configService.get<string>('GOOGLE_CALLBACK_URL');

    return new Strategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: callbackURL,
        passReqToCallback: true,
      },
      this.validate.bind(this),
    );
  }
  async loginWithOAuth(user: any): Promise<{ token: string }> {
    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
  async validateGithub(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    try {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);

      const userDetails2: UserDetails2 = {
        email: profile.emails[0].value,
        name: profile.displayName || '',
      };
      const user = await this.validateUser2(userDetails2);
      return done(null, user);
    } catch (err) {
      console.error('GitHub OAuth validation error:', err);
      return done(err, false);
    }
  }
  configureGithubStrategy(): GithubStrategyy {
    const githubClientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const githubClientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');
    const callbackURL = this.configService.get<string>('GITHUB_CALLBACK_URL');
    return new GithubStrategyy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: callbackURL,
        scope: ['user:email'],
      },
      this.validateGithub.bind(this),
    );
  }
  async validateOAuthLogin(user: any): Promise<any> {
    const userDetails2: UserDetails2 = {
      email: user.email,
      name: user.displayName || user.username,
    };

    return this.validateUser2(userDetails2);
  }
  configureFacebookStrategy(): GithubStrategyy {
    const facebookClientId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const facebooktSecret = this.configService.get<string>('FACEBOOK_CLIENT_SECRET');
    const callbackURL = this.configService.get<string>('FACEBOOK_CALLBACK_URL');
    return new GithubStrategyy(
      {
        clientID: facebookClientId,
        clientSecret: facebooktSecret,
        callbackURL: callbackURL,
        scope: ['user:email'],
      },
      this.validateGithub.bind(this),
    );
  }

}
