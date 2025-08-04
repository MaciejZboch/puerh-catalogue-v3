import { required } from 'joi';
import mongoose, { Document, Types, Model, model} from 'mongoose';
const Schema = mongoose.Schema;

export interface IReview extends Document {
  body: string;
  rating: number;
  author: Types.ObjectId;
  tea: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IReviewModel extends Model<IReview> {}


const reviewSchema = new Schema<IReview, IReviewModel>({
    body: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tea: {
    type: Schema.Types.ObjectId,
    ref: "Tea",
    required: true
  }
  }, { timestamps: true });

export default model<IReview, IReviewModel>("Review", reviewSchema);