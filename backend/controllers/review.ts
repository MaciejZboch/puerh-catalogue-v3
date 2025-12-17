import Review, { IReview } from "../models/review";
import Tea from "../models/tea";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const create = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized!" });
  }
  const tea = await Tea.findById(req.params.id);
  if (!tea) {
    return res.status(404).json({ error: "Tea not found!" });
  }

  const review: IReview = new Review(req.body.review);

  review.author = req.user._id;
  review.tea = tea._id as Types.ObjectId;

  await review.save();

  await review.populate("author");
  return res.json(review);
};

export const remove = async (req: Request, res: Response) => {
  await Review.findByIdAndDelete(req.params.reviewId);
  return res.status(200).json({ message: "Review deleted!" });
};
