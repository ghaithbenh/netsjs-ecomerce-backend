import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {  UserDocument } from './shemas/user.Schema';
import { UserDetails } from './interfaces/user-details.interface';
import { UserDetails2 } from './interfaces/user-details2.interface';
import { UserDocument2 } from './shemas/user.schema2';
import { User } from './user.model';


@Injectable()
export class UserService {
    constructor (@InjectModel('User') private readonly userModel: Model<UserDocument,UserDocument2>  ){}
    _getUserDetails(user: UserDocument): UserDetails {
        return {
          id: (user._id).toString(),
          name: user.name,
          email: user.email,
        };
      }

      async findByEmail(email:string):Promise<UserDocument | null>{
          return this.userModel.findOne({email}).exec();
      }

        async findById(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this._getUserDetails(user);
  }


      async create(
        name:string,
        email:string,
        hashedPassword:string
    ):Promise<UserDocument>{
        const newUser=new  this.userModel({
            name, 
            email,
            password:hashedPassword
        });
        
        return newUser.save()
      }
      async create2(email: string, name: string): Promise<User> {
        const newUser = new this.userModel({ email, name});
        return await newUser.save();
      }
      _getUserDetails2(user: UserDocument2): Partial<UserDocument2> {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          googleId: user.googleId,
          avatarUrl: user.avatarUrl,
        };
      }
}

