import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProducerSchema = new Schema({
  name: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Producer = mongoose.model("Producer", ProducerSchema);
export default Producer;