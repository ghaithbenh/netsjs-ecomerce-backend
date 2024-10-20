import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../../auth.service';

import { Strategy as GithubStrategyy, Profile as GithubProfile } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserDetails2 } from 'src/user/interfaces/user-details2.interface';

@Injectable()
export class GithubStrategy extends PassportStrategy(GithubStrategyy, 'github') {
   
        constructor(private readonly authService: AuthService) {
          super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GithubProfile,
    done: (error: any, user?: any) => void,
  ): Promise<any> {
    try {
      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);
      console.log('Profile:', profile);

      // Check if profile.emails is defined and not empty
      if (!profile.emails || profile.emails.length === 0) {
        // Fetch emails from GitHub API
        const response = await axios.get('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        
        // Find primary email
        const primaryEmail = response.data.find(email => email.primary)?.email;
        
        if (!primaryEmail) {
          return done('Email not provided by GitHub', false);
        }
        
        profile.emails = [{ value: primaryEmail }];
      }

      const userDetails2: UserDetails2 = {
        email: profile.emails[0].value,
        name: profile.displayName || '',
      };

      const user = await this.authService.validateUser2(userDetails2);
      done(null, user);
    } catch (error) {
      console.error('Error in GithubStrategy validate:', error);
      done(error, null);
    }
  }
}