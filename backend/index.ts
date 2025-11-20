import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

// Routes & Models
import User from "./models/user";
import userRoutes from "./routes/users";
import teaRoutes from "./routes/tea";
import reviewRoutes from "./routes/review";
import moderateRoutes from "./routes/moderate";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const DB_URL = process.env.DB_URL;
const SECRET_KEY = process.env.SECRET_KEY;
const OPTIONAL_SECRET = process.env.OPTIONAL_SECRET || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

if (!DB_URL || !SECRET_KEY) throw new Error("Missing DB_URL or SECRET_KEY");

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS ---
app.use(cors({
  origin: FRONTEND_URL,      // exact frontend URL
  credentials: true           // allow cookies
}));

// Preflight requests
app.options("*", cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// --- Session ---
app.use(session({
  secret: Buffer.from(SECRET_KEY) as crypto.CipherKey,
  store: MongoStore.create({
    mongoUrl: DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: { secret: OPTIONAL_SECRET }
  }),
  resave: false,
  saveUninitialized: false,    // don't save empty sessions
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "none",          // required for cross-origin cookies
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- MongoDB ---
mongoose.connect(DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- Routes ---
app.use("/api", userRoutes);
app.use("/api/teas", teaRoutes);
app.use("/api/teas", reviewRoutes);
app.use("/api/moderate", moderateRoutes);

// --- Error handling ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
