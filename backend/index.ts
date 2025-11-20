import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Routes and models
import User from './models/user';
import userRoutes from './routes/users';
import teaRoutes from './routes/tea';
import reviewRoutes from './routes/review';
import moderateRoutes from './routes/moderate';

// Passport local strategy
const LocalStrategy = require('passport-local');

dotenv.config();

const app = express();

//Environment variables
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const OPTIONAL_SECRET = process.env.OPTIONAL_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!DB_URL) throw new Error('Missing DB_URL in environment variables');
if (!SECRET_KEY) throw new Error('Missing SECRET_KEY in environment variables');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000'],
    credentials: true,
  })
);
app.options("/api/*", cors({
  origin: FRONTEND_URL,
  credentials: true
}));

//Session
app.use(
  session({
    secret: Buffer.from(SECRET_KEY) as crypto.CipherKey,
    store: MongoStore.create({
      mongoUrl: DB_URL,
      touchAfter: 24 * 60 * 60, // 24 hours
      crypto: { secret: OPTIONAL_SECRET },
    }),
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: 'none',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS in prod
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
).on('error', (e) => console.log('Session store error!', e));

//Save session on GET requests
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    req.session.save((err) => {
      if (err) console.log('Session save error:', err);
    });
  }
  next();
});

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Locals
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.user;
  res.locals.baseUrl = req.baseUrl;
  res.locals.filters = req.query;
  next();
});

//MongoDB
mongoose
  .connect(DB_URL)
  .then(() => console.log('MongoDB connection successful!'))
  .catch((err) => console.log('MongoDB connection error:', err));

//Routes
app.use('/api', userRoutes);
app.use('/api/teas', teaRoutes);
app.use('/api/teas', reviewRoutes);
app.use('/api/moderate', moderateRoutes);

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
