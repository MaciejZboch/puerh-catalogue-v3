import {Schema, Types, model, Model} from "mongoose";
import ImageSchema from "./image";
import { Document } from 'mongoose';

interface IImage extends Document {
  url: string,
  filename: String
}
export interface ITea extends Document {
  name: string;
  description: string;
  images: Types.Array<IImage>;
  type: 'Raw / Sheng' | 'Ripe / Shu' | 'blend';
  year: number;
  region: string;
  village: string;
  ageing_location: string;
  ageing_conditions: 'Dry' | 'Natural' | 'Wet' | 'Hong-Kong Traditional' | 'Unknown';
  shape: 'Loose' | 'Cake' | 'Tuo' | 'Brick' | 'Mushroom' | 'Dragon ball' | 'Tube' | 'Melon' | 'Other';
  producer: Types.ObjectId | null;
  vendor: Types.ObjectId | null;
  author: Types.ObjectId;
  owners: Types.Array<Types.ObjectId>;
  sizeInGrams: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
  pricePerGram: number;
}

interface ITeaModel extends Model<ITea> {}


const TeaSchema = new Schema({
  name: String,
  description: String,
  images: [{
    url: String,
    filename: String
  }],
  type: { type: String, enum: ["Raw / Sheng", "Ripe / Shu", "blend"] },
  year: Number,
  region: String,
  village: String,
  ageing_location: String,
  ageing_conditions: {
    type: String,
    enum: ["Dry", "Natural", "Wet", "Hong-Kong Traditional", "Unknown"],
  },
  shape: {
    type: String,
    enum: [
      "Loose",
      "Cake",
      "Tuo",
      "Brick",
      "Mushroom",
      "Dragon ball",
      "Tube",
      "Melon",
      "Other",
    ],
  },
  producer: {
    type: Schema.Types.ObjectId,
    ref: "Producer",
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  owners: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sizeInGrams: Number,
  price: Number,
});

//setting price per gram virtual
TeaSchema.virtual("pricePerGram").get(function (this: any) {
  return this.price / this.sizeInGrams;
});

//setting up an index to search in all fields
TeaSchema.index({
  name: "text",
  type: "text",
  region: "text",
  village: "text",
  ageing_location: "text",
  ageing_conditions: "text",
  shape: "text",
  vendor: "text",
  producer: "text",
});

TeaSchema.set("toObject", { virtuals: true });
TeaSchema.set("toJSON", { virtuals: true });


const Tea: ITeaModel = model<ITea, ITeaModel>("Tea", TeaSchema);
export default Tea;