import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import Image from "./image";
import { PassportLocalModel, PassportLocalDocument } from 'mongoose';
import { Types } from "joi";


const Schema = mongoose.Schema;

export interface IUser extends PassportLocalDocument {
  email: string;
  moderator?: boolean;
    image?: {
    url: String,
    filename: String
  },
  following: mongoose.Types.Array<mongoose.Types.ObjectId>;
}




const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  moderator: {
    type: Boolean,
  },
  image: {
    url: String,
    filename: String
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
UserSchema.plugin(passportLocalMongoose);

interface IUserModel extends PassportLocalModel<IUser> {}
const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default User;