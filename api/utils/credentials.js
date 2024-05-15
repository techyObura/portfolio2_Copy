import allowedOrigins from "./allowedOrigins.js";

const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", [
      "Content-Type",
      "content-type",
      "Authorization",
      "authorization",
    ]);
  }
  next();
};

export default credentials;
