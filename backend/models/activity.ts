import mongoose, {Document} from "mongoose";
const Schema = mongoose.Schema;

export interface IActivity extends Document {
user?: mongoose.Types.ObjectId,
type: 'review' | 'tea',
refId: mongoose.Types.ObjectId,
createdAt: Date;
}

const activitySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["review", "tea"], required: true },
  refId: { type: Schema.Types.ObjectId, required: true }, // points to the Review or Tea
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IActivity>('Activity', activitySchema);