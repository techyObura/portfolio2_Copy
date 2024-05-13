import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import corsOptions from "./utils/corsOptions.js";
import credentials from "./utils/credentials.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import Comment from "./models/comment.model.js";
import verifyToken from "./middleware/verifyToken.js";
import backRoutes from "./routes/back.route.js";
import sliderRoutes from "./routes/slider.route.js";
import projectRoutes from "./routes/project.route.js";
import path from "path";

dotenv.config();
const app = express();
connectDB();

const __dirname = path.resolve();

//middleware
app.use(express.json());

/* app.use(credentials); */
/* app.use(cors(corsOptions)); */

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/back", backRoutes);
app.use("/api/slider", sliderRoutes);
app.use("/api/projects", projectRoutes);

app.get("/api/comment/get", verifyToken, async (req, res, next) => {
  if (!req.user.isAdmin) {
    next("Cannot access all comments");
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const comments = await Comment.find({})
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();
    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ comments, totalComments, lastMonthComments });
  } catch (error) {
    next(error.message);
  }
});

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
//error Middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
  next();
});

app.listen(7000, () => {
  console.log(`Server running on port 7000`);
});
