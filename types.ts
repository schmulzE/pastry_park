export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  _doc?: any
}

export interface IRecipe {
  _id?: string;
  title: string;
  description: string;
  yields: string;
  source: string;
  image: string;
  video_url: string;
  cookingtime: ICookingtime[];
  category: string;
  rating?:number;
  url: string;
  ingredients: string[];
  steps: string[];
  user_id: string;
}

export interface ICookingtime {
  id: string
  title: string;
  hours: number;
  minutes: number;
}

export type UserWithoutPassword = Omit<User, "password">;
