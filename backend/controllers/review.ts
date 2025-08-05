import Review, {IReview} from '../models/review';
import Tea from '../models/tea';
import Activity from '../models/activity';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

export const create = async (req: Request, res: Response) => {
    if (!req.user) {
  return res.status(401).json({ error: "Unauthorized!" });
}
  const tea = await Tea.findById(req.params.id);
  if (!tea) {
    req.flash("error", "Tea not found.");
    return res.redirect("/tea");
  }

  const review: IReview = new Review(req.body.review);

  review.author = req.user._id;
  review.tea = tea._id as Types.ObjectId;

  await review.save();

  //logging activity with timestamp
  const activity = new Activity({
    user: req.user._id,
    type: "review",
    refId: review._id,
  });
  await activity.save();
  req.flash("success", "Succesfully made a new review!");
  res.redirect(`/tea/${tea._id}`);
};

export const remove = async (req: Request, res: Response) => {
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Succesfully deleted a review!");
  res.redirect(`/tea/${req.params.id}`);
};
