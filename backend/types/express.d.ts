import { Types } from 'mongoose';
import {MulterFile} from 'multer';
import { Session, SessionData } from 'express-session';

declare global {
  namespace Express {
    interface User {
        _id: Types.ObjectId;
        email: string;
        moderator?: boolean;
        image?: any;
        following: Types.ObjectId[];
    }

    interface Request {
      user?: User;
      files?: MulterFile[];
    }
  }
}