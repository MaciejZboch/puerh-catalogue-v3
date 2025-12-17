import mongoose from "mongoose";
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  name: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

const Vendor = mongoose.model("Vendor", VendorSchema);
export default Vendor;
