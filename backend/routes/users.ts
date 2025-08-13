import express from 'express';
const router = express.Router();
import catchAsync from '../utilities/catchAsync';
import {register, login, logout, follow, unfollow} from '../controllers/users';
const {
  hasNoSpecialSymbols,
  isLoggedIn,
  isNotStatic,
} = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/register")
  .post(
    hasNoSpecialSymbols,
    upload.single("image"),
    catchAsync(register)
  );

router.route("/login").post(isNotStatic, login);
router.get("/logout", isLoggedIn, logout);
router.put("/users/:id", isLoggedIn, follow); //follow route
router.delete("/users/:id", isLoggedIn, unfollow);

export default router;
