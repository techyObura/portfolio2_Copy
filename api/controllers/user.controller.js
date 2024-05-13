import errorHandler from "../middleware/errorHandler.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

//get user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//get users
export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    next(errorHandler(404, "You are not allowed to access all accounts"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    const totalUsers = await User.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res
      .status(200)
      .json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });
  } catch (error) {
    next(error.message);
  }
};

//delete user
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    next(errorHandler(404, "You are not allowed to delete this account"));
  }

  if (!req.user.isAdmin) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.userId);
      if (!deletedUser) {
        next(errorHandler(500, "Error deleting user"));
      }

      res.status(200).json("User deleted successfully");
    } catch (error) {
      next(errorHandler(500, error.message));
    }
  } else {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        next(errorHandler(500, "Error deleting user"));
      }

      res.status(200).json("User deleted successfully");
    } catch (error) {
      next(errorHandler(500, error.message));
    }
  }
};

//update User
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePhoto: req.body.profilePhoto,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const accessToken = generateToken(updatedUser);
    const { password, ...rest } = updatedUser._doc;
    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true })
      .json({ accessToken, ...rest });
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};

//logout User
export const logoutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("accessToken")
      .status(200)
      .json("User logged out successfully");
  } catch (error) {
    next(errorHandler(500, error.message));
  }
};
