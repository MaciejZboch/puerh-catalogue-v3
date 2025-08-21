import express from 'express';
const router = express.Router();
import catchAsync from '../utilities/catchAsync';
import {register, login, logout, follow, unfollow} from '../controllers/users';
import { typeguardUser} from '../middleware';
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
router.put("/users/:id", typeguardUser, isLoggedIn, follow);
router.delete("/users/:id",typeguardUser, isLoggedIn, unfollow);

export default router;
