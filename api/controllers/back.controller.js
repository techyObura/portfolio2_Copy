import Back from "../models/back.model.js";

export const editBackground = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next("You are not allowed to edit");
  }

  try {
    const background = await Back.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.status(200).json(background);
  } catch (error) {
    next(error.message);
  }
};
export const getBackground = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next("You are not allowed!");
  }

  try {
    const background = await Back.findById(req.params.id);
    res.status(200).json(background);
  } catch (error) {
    next(error.message);
  }
};
