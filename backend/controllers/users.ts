import User, { IUser } from "../models/user";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

interface UserWithId extends IUser {
  _id: Types.ObjectId;
}

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  //validations
  function hasWhiteSpace(s: string) {
    return s.indexOf(" ") >= 0;
  }
  const { email, username, password } = req.body;
  if (
    username.length < 6 ||
    password.length < 6 ||
    hasWhiteSpace(password) ||
    hasWhiteSpace(username)
  ) {
    return res
      .status(400)
      .json({
        error:
          "Please make sure your username and password are at least 6 letter long and contain no spaces!",
      });
  } else {
    //actual user creation
    try {
      const user = new User({ email, username });
      user.moderator = false;
      if (req.file) {
        user.image = { url: req.file.path, filename: req.file.filename };
      }
      const registeredUser = await User.register(user, password);
      req.login(<UserWithId>registeredUser, (err) => {
        if (err) return next(err);
        return res
          .status(201)
          .json({ message: "Welcome!", user: registeredUser });
      });
    } catch (e: any) {
      if (e.code === 11000) {
        return res.status(400).json({
          error:
            "This email is taken! An account with this email already exists.",
        });
      } else if (e.name === "UserExistsError") {
        return res.status(400).json({
          error:
            "This username is taken! An account with this username already exists.",
        });
      } else {
        return res
          .status(500)
          .json({ error: e.message || "Registration failed" });
      }
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: Express.User | false,
      info: { message?: string } | undefined,
    ) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials!" });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json(user);
      });
    },
  )(req, res, next);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Goodbye!" });
  });
};

export const follow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized!" });
  }
  const currentUserId = req.user._id;
  const currentUser = await User.findById(currentUserId);
  const userIdToFollow = new Types.ObjectId(req.params.id);

  // Null guard
  if (currentUser == null) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  // Avoid duplicates
  if (
    !currentUser.following.includes(userIdToFollow) &&
    userIdToFollow.toString() != currentUserId.toString()
  ) {
    currentUser.following.push(userIdToFollow);
    await currentUser.save();
    return res.status(200).json({ message: "Following user!" });
  } else {
    return res
      .status(400)
      .json({ error: "You're already following this user!" });
  }
};

export const unfollow = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized!" });
  }
  const currentUserId = req.user._id;
  const currentUser = await User.findById(currentUserId);
  const userIdToUnfollow = req.params.id as unknown as Types.ObjectId;
  // Avoid duplicates
  if (currentUser == null) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  if (
    currentUser.following.includes(userIdToUnfollow) &&
    userIdToUnfollow.toString() != currentUserId.toString()
  ) {
    currentUser.following.pull(userIdToUnfollow);
    await currentUser.save();
    return res.status(200).json({ message: "Producer unfollowed!" });
  } else {
    return res
      .status(400)
      .json({ error: "You're already following this user!" });
  }
};
