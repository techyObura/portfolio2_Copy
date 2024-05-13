import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.jwtSecret
  );

  return token;
};

export default generateToken;
