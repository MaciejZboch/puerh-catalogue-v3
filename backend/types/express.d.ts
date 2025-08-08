// src/types/express.d.ts (or similar location)
import { Types } from 'mongoose';
import {MulterFiles} from 'multer';

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
    }

    interface Request {
      files?: MulterFiles;
    }
  }
}