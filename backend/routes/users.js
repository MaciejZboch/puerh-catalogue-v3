import express from 'express';
const router = express.Router();
import catchAsync from '../utilities/catchAsync';
import users from '../controllers/users';
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
  .get(users.registerForm)
  .post(
    hasNoSpecialSymbols,
    upload.single("image"),
    catchAsync(users.register)
  );

router.route("/login").get(users.loginForm).post(isNotStatic, users.login);
router.get("/logout", isLoggedIn, users.logout);
router.put("/users/:id", isLoggedIn, users.follow); //follow route
router.delete("/users/:id", isLoggedIn, users.unfollow);

export default router;
