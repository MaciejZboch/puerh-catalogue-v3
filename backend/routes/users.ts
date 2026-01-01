import express from "express";
const router = express.Router();
import catchAsync from "../utilities/catchAsync";
import {
  register,
  login,
  logout,
  follow,
  unfollow,
} from "../controllers/users";
import { typeguardUser } from "../expressmiddleware";
const {
  hasNoSpecialSymbols,
  isLoggedIn,
  isNotStatic,
} = require("../expressmiddleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/register")
  .post(hasNoSpecialSymbols, upload.single("image"), catchAsync(register));

router.route("/login").post(isNotStatic, login);
router.get("/logout", isLoggedIn, logout);
router.put("/users/:id", typeguardUser, isLoggedIn, follow);
router.delete("/users/:id", typeguardUser, isLoggedIn, unfollow);
router.get("/me", (req, res) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
  });

  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ error: "Not authorized!" });
  }
});

export default router;
