import errorHandler from "../middleware/errorHandler.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      !email ||
      !password ||
      !username ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(500, "All fields are required"));
    }

    const user = await User.findOne({ email });
    const user_name = await User.findOne({ username });

    if (user) {
      return next(errorHandler(500, "User already exist. Please login"));
    }

    if (user_name) {
      return next(
        errorHandler(500, "Username already used. Enter another username")
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    try {
      if (newUser) {
        await newUser.save();
        res.status(201).json("Sign up successful");
      } else {
        return next(errorHandler(500, `Error when creating User`));
      }
    } catch (error) {
      return next(errorHandler(500, `Error: ${error.message}`));
    }
  } catch (error) {
    next(errorHandler(500, `Error: ${error.message}`));
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(500, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(
        errorHandler(404, "You do not have an account. Kindly create one")
      );
    }

    const comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return next(errorHandler(500, "Wrong password. Kindly try again"));
    } else {
      const accessToken = generateToken(user);

      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true })
        .json({ accessToken, ...rest });
    }
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const googleAuth = async (req, res, next) => {
  const { username, email, profilePhoto } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      const accessToken = generateToken(user);
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true })
        .json({ accessToken, ...rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        password: hashedPassword,
        username:
          username.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        profilePhoto,
      });
      await newUser.save();
      const accessToken = generateToken(newUser);
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true })
        .json({ accessToken, ...rest });
    }
  } catch (error) {
    next(errorHandler(404, error.message));
  }
};
