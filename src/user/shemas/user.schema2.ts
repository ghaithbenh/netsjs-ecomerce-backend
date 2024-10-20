import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument2 = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  id?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  googleId?: string;

  @Prop()
  githubId?: string;
  
  @Prop()
  facebookId?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ required: false })
  password?: string;
}

export const UserSchema2 = SchemaFactory.createForClass(User);
