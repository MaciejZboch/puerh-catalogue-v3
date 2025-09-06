//Dependency imports
import express, {NextFunction, Request, Response} from 'express'
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo'
import helmet from 'helmet';
import passport from 'passport';
const LocalStrategy = require("passport-local");
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

//Other imports
import User from './models/user';
import userRoutes from './routes/users';
import teaRoutes from './routes/tea';
import reviewRoutes from './routes/review';
import editRoutes from './routes/edit';
import moderateRoutes from './routes/moderate';

//JSON setup for React
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//.env setup
dotenv.config();

export const secret = Buffer.from(
  process.env.SECRET_KEY as string
) as crypto.CipherKey;

export const secretOptional =
  (process.env.OPTIONAL_SECRET as string) || false;
  
//MongoDB setup
//const dbUrl = 'mongodb://localhost:27017/test'; //local DB for development
const dbUrl = process.env.DB_URL; //production DB in cloud

if (!dbUrl) {
  throw new Error("Missing DB_URL in environment variables");
}

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('Mongo connection succesful!');
  })
  .catch((err) => {
    console.log('Mongo error!');
    console.log(err);
  });

//Cors setup
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true //allow cookies/auth headers
})); 

//Session setup
app.use(session({
  secret,
  store: MongoStore.create({ 
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
  crypto: {
    secret: secretOptional
  }
}),
  resave: false,
  saveUninitialized: true,
  cookie: {
    sameSite: "lax",
    httpOnly: true,
    secure: false, // Enable in production with HTTPS
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
})).on("error", function (e) {
  console.log("session store error!", e);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === "GET" &&
    req.path !== "/login" &&
    req.path !== "/logout" &&
    req.path !== "/favicon.ico" &&
    !req.path.startsWith("/tea/stylesheets") && //Ignore CSS
    !req.path.startsWith("/images") && //Ignore images
    !req.path.startsWith("/scripts") //Ignore scripts
  ) {
    req.session.save((err) => {
      if (err) console.log("Session save error:", err);
    });
  }
  next();
});

app.use(helmet()); //Helmet setup

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Use plugin-provided LocalStrategy
passport.use(User.createStrategy());

// Use plugin-provided session serialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Locals setup
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.currentUser = req.user;
  res.locals.baseUrl = req.baseUrl;
  res.locals.filters = req.query;
  next();
});

//Routes setup
app.use("/api/", userRoutes);
app.use("/api/teas", teaRoutes);
app.use("/api/teas", reviewRoutes);
app.use("/api/edit", editRoutes);
app.use("/api/moderate", moderateRoutes);

app.listen(4000)