import ExpressError from './utilities/ExpressError';
import { teaSchema, reviewSchema, vendorSchema } from './schemas.js';
import { Request, Response, NextFunction } from 'express';
import Tea from './models/tea';
import Review from './models/review';

//tea middleware
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Log in to proceed!");
    return res.redirect("/login");
  }
  next();
};
export const isAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const tea = await Tea.findById(req.params.id);
  if (!tea.author.equals(req.user._id)) {
    req.flash("error", "No permission to do that!");
    return res.redirect("/tea/" + tea.id);
  }
  next();
};
export const validateTea = (req: Request, res: Response, next: NextFunction) => {
  const { error } = teaSchema.validate(req.body.tea);
  const { error2 } = vendorSchema.validate(req.body.vendor);
  if (error || error2) {
    const msg = error.details.map((el) => el.message).join(",");
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
        req.flash(
          "error",
          "Special characters not allowed, please use only letters and numbers!"
        );
        return res.redirect(req.get("Referer") || "/");
      }
    }
  }

  next();
};

//review middleware
export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

export const isReviewAuthor = async (req: Request, res: Response, next: NextFunction) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review.author.equals(req.user._id) && req.user.moderator !== true) {
    req.flash("error", "No permission to do that!");
    return res.redirect("/tea/" + req.params.id);
  }
  next();
};

//vendor / producer middleware for mods

export const isMod = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.moderator !== true) {
    req.flash("error", "No permission to do that!");
    return res.redirect("/tea");
  }
  next();
};

//user middleware

export const isNotStatic = (req: Request, res: Response, next: NextFunction) => {
  const isStatic = /\.(ico|css|js|png|jpg|jpeg|svg|woff2?|ttf|map)$/.test(req.path);
  const isAuthRoute =
    req.path.startsWith("/login") || req.path.startsWith("/signup");

  if (!isStatic && !isAuthRoute && req.method === "GET") {
    req.session.returnTo = req.originalUrl;
  }

  next();
};
