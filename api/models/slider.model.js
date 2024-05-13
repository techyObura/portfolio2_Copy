import mongoose from "mongoose";

const Schema = mongoose.Schema;

const sliderSchema = new Schema(
  {
    description: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: false,
    },

    subTitle: {
      type: String,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },

    url: {
      type: String,
      required: false,
    },
    urlName: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Slider = mongoose.model("Slider", sliderSchema);
export default Slider;
