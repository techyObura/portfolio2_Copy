import Slider from "../models/slider.model.js";

export const createSlider = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next("You are not allowed!");
    }

    try {
      const newSlider = await Slider.create({ ...req.body });
      res.status(200).json(newSlider);
    } catch (error) {
      next("Cannot create slider: " + error.message);
    }
  } catch (error) {
    next(error.message);
  }
};
export const getSliders = async (req, res, next) => {
  try {
    const slides = await Slider.find().sort({ createdAt: 1 });
    res.status(200).json(slides);
  } catch (error) {
    next(error.message);
  }
};
export const deleteSlider = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next("You are not allowed!");
    }
    await Slider.findByIdAndDelete(req.params.id);

    res.status(200).json("Deleted");
  } catch (error) {
    next(error.message);
  }
};
