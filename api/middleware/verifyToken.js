import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler.js";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(errorHandler(500, "Invalid authorization header"));
  } else {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.jwtSecret, (err, data) => {
      if (err) {
        return next(errorHandler(500, "token is not valid"));
      }
      req.user = data;
      next();
    });
  }
};

export default verifyToken;
