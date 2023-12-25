import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  refresh_token: String 
},
  {
    virtuals:{
      id: {
        get(){
          return this._id
        }
      }
    },
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  },
);

export const Users = model("User", UserSchema);

export async function getUserById(id: string) {
  return await Users.findOne({ _id: id });
}
