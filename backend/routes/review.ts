import express from 'express';
import { isReviewAuthor, isLoggedIn, validateReview } from '../middleware';
const router = express.Router();
import catchAsync  from '../utilities/catchAsync';("../utilities/catchAsync");
import {create, remove} from '../controllers/review';

router.post("/:id/review", isLoggedIn, validateReview, catchAsync(create));

router.delete(
  "/:id/review/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(remove)
);
export default router;
