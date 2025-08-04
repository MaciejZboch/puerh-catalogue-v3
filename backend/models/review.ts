import mongoose, { Document, Types } from 'mongoose';
const Schema = mongoose.Schema;

export interface IReview extends Document {
  body: string;
  rating: number;
  author: Types.ObjectId;
  tea: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}



const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  tea: {
    type: Schema.Types.ObjectId,
    ref: "Tea",
  },
});

export const Review = mongoose.model("Review", reviewSchema);