import { Schema, model } from 'mongoose';
import { emailRegExp } from '../../constants/users-constants.js';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: emailRegExp,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = model('users', userSchema);
