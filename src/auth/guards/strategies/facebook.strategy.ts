import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import axios from 'axios';
import { AuthService } from '../../auth.service';
import { UserDetails2 } from 'src/user/interfaces/user-details2.interface';


@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'name', 'emails', 'photos'],
      scope: ['email']
      

    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);

      let email = profile.emails?.[0]?.value;
      if (!email) {
        // If email is not provided in profile, fetch it from Facebook Graph API
        const response = await axios.get(`https://graph.facebook.com/v13.0/${profile.id}?fields=email&access_token=${accessToken}`);
        email = response.data?.email;
      }

      if (!email) {
        throw new UnauthorizedException('No email found for the user');
      }

      const userDetails2: UserDetails2 = {
        email,
        name: profile.displayName || '',
      };

      const user = await this.authService.validateUser2(userDetails2);
      done(null, user);
    } catch (err) {
      console.error('Facebook OAuth validation error:', err);
      done(err, false);
    }
  }
}
