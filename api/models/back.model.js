import mongoose from "mongoose";

const Schema = mongoose.Schema;

const backSchema = new Schema(
  {
    photo: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-Images.png",
    },
  },
  { timestamps: true }
);

const Back = mongoose.model("Back", backSchema);

export default Back;
