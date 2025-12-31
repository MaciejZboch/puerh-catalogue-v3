import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import cookieParser = require("cookie-parser");

// Routes and models
import User from "./models/user";
import userRoutes from "./routes/users";
import teaRoutes from "./routes/tea";
import reviewRoutes from "./routes/review";
import moderateRoutes from "./routes/moderate";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
//Environment variables
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const OPTIONAL_SECRET = process.env.OPTIONAL_SECRET || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

if (!DB_URL) throw new Error("Missing DB_URL in environment variables");
if (!SECRET_KEY) throw new Error("Missing SECRET_KEY in environment variables");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server requests or curl
      if (origin === FRONTEND_URL) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

//Session
app
  .use(
    session({
      proxy: true, //backend on render requires this to work with vercel frontend
      secret: Buffer.from(SECRET_KEY) as crypto.CipherKey,
      store: MongoStore.create({
        mongoUrl: DB_URL,
        touchAfter: 24 * 60 * 60, // 24 hours
        crypto: { secret: OPTIONAL_SECRET },
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //lax in dev to account for lack of HTTPS
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only send cookie over HTTPS in prod
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
    })
  )
  .on("error", (e) => console.log("Session store error!", e));

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
  .then(() => console.log("MongoDB connection successful!"))
  .catch((err) => console.log("MongoDB connection error:", err));

//Routes
app.use("/api", userRoutes);
app.use("/api/teas", teaRoutes);
app.use("/api/teas", reviewRoutes);
app.use("/api/moderate", moderateRoutes);

//Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
