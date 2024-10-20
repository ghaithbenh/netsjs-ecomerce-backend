import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../../auth.service';
import { UserDetails2 } from 'src/user/interfaces/user-details2.interface';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): Promise<any> {
    try {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);

      const userDetails2: UserDetails2 = {
        email: profile.emails[0].value,
        name: profile.displayName,
      };
  
        const user = await this.authService.validateUser2(userDetails2);
        done(null, user);
      } catch (error) {
        console.error('Error in GoogleStrategy validate:', error);
        done(error, null);
      }
    }
  
    // Optionally, handle specific errors from the OAuth flow
    async handleRequest(err: any, user: any, info: any): Promise<any> {
      if (err) {
        console.error('Error in GoogleStrategy handleRequest:', err);
        throw err;
      }
      return user;
    }
  }