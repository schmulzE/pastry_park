import { Types } from "mongoose";

export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface IRecipe {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  yields?: string;
  source: string;
  image: string;
  video_url?: string;
  cookingtime: ICookingtime[];
  category: string;
  rating?:number;
  url: string;
  ingredients: string[];
  steps: string[];
  created_by: string;
}

export interface ICookingtime {
  id: string
  title: string;
  hours: number;
  minutes: number;
}

export interface IRecipeIngredient {
  id: string;
  quantity: string | null;
  unit: string | null;
  note: string;
}

// export type UserWithoutPassword = Omit<User, "password">;
