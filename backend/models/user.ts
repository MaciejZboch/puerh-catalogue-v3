import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import ImageSchema from "./image";
import { PassportLocalModel, PassportLocalDocument } from 'mongoose';


const Schema = mongoose.Schema;

export interface IUser extends PassportLocalDocument {
  email: string;
  moderator?: boolean;
  image?: any;
  following: mongoose.Types.ObjectId[];
}

interface IUserModel extends PassportLocalModel<IUser> {}


const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  moderator: {
    type: Boolean,
  },
  image: ImageSchema,
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});
UserSchema.plugin(passportLocalMongoose);

const User: IUserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);
export default User;