import { Types } from 'mongoose';
import {MulterFile} from 'multer';
import { Session, SessionData } from 'express-session';
import { IUser } from '../models/user';
import { ParamsDictionary } from "express-serve-static-core";
import { Request } from "express";

declare global {
  namespace Express {
    interface User extends IUser {
      _id: Types.ObjectId;
    }
  }
}

export interface AuthenticatedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: IUser & { _id: Types.ObjectId };
  files?: MulterFile[];
}