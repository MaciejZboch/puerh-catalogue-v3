import { Types } from 'mongoose';
import {MulterFiles} from 'multer';
import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    returnTo?: string;
  }
}

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
      files?: MulterFiles;
      session: Session & Partial<SessionData>;
    }
  }
}