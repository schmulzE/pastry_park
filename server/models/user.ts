import { Schema, model } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    length: [8, "Password must be at least 8 characters long"],
  },
});

export const User = model<UserDocument>("User", UserSchema);