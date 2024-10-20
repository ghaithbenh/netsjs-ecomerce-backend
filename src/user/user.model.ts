// src/user/user.model.ts

import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  // other fields
});

// Optionally, add a pre-save hook for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    // Hash password logic (bcrypt example)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

export interface User extends mongoose.Document {
  email: string;
  password?: string;
  // other fields
}

export const UserModel = mongoose.model<User>('User', UserSchema);
