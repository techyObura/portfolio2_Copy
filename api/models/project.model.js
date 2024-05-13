import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },

    title: {
      type: String,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },

    url: {
      type: String,
      required: true,
      unique: true,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
