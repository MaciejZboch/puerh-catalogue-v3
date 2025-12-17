import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface IImage extends Document {
  url: string;
  filename: String;
}

interface IImageVirtuals {
  thumbnail: string;
  square: string;
}

type ImageDocument = IImage & IImageVirtuals;

const ImageSchema = new Schema<ImageDocument>({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function (this: ImageDocument) {
  return this.url.replace("/upload", "/upload/w_40,ar_1:1,c_fill,g_auto");
});

ImageSchema.virtual("square").get(function (this: ImageDocument) {
  return this.url.replace("/upload", "/upload/w_500,ar_1:1,c_fill,g_auto");
});

const Image = mongoose.model("Image", ImageSchema);
export default Image;
