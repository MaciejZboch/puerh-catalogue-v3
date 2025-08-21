import ExpressError from './utilities/ExpressError';
import { teaSchema, reviewSchema, vendorSchema } from './schemas.js';
import { Request, Response, NextFunction } from 'express';
import Tea from './models/tea';
import Review from './models/review';
import { AuthenticatedRequest } from './types/express';
import { RequestHandler } from "express";

//req.user._id typeguard



export const typeguardUser: RequestHandler = (req, res, next) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    res.status(401).json({ error: "Unauthorized!" });
    return;
  }

  next();
};

//tea middleware
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
   return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const tea = await Tea.findById(req.params.id);
  if (req.user && tea && !tea.author.equals(req.user._id)) {
   return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
export const validateTea = (req: Request, res: Response, next: NextFunction) => {
  const { error } = teaSchema.validate(req.body.tea);
  const { error2 } = vendorSchema.validate(req.body.vendor);
  if (error || error2) {
    const msg = error.details.map((el: any) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
export const hasNoSpecialSymbols = (req: Request, res: Response, next: NextFunction) => {
  const allowedCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.";

  for (const key in req.body) {
    const s = req.body[key]; // Get the value of each field

    if (typeof s !== "string") continue; // Skip non-string values

    for (let char of s) {
      if (!allowedCharacters.includes(char)) {
 return res
          .status(400)
          .json({ error: "Special characters not allowed. Use only letters/numbers." })
      }
    }
  }

  next();
};

//review middleware
export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el: any) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {return res.status(401).json({ error: "Unauthorized!" })};
  const review = await Review.findById(req.params.reviewId);
  if (review && !review.author.equals(req.user._id) && req.user.moderator !== true) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

//vendor / producer middleware for mods

export const isMod = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.moderator !== true) {
  return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

//user middleware

export const isNotStatic = (req: Request, res: Response, next: NextFunction) => {
  const isStatic = /\.(ico|css|js|png|jpg|jpeg|svg|woff2?|ttf|map)$/.test(req.path);
  const isAuthRoute = req.path.startsWith("/login") || req.path.startsWith("/signup");
  if (!isStatic && !isAuthRoute && req.method === "GET") {
    res.setHeader("X-Return-To", req.originalUrl);
  }
  next();
};
