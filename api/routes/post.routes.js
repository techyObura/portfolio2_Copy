import express from "express";
import {
  createPost,
  deletePost,
  getPosts,
  updatePost,
} from "../controllers/post.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create/:id", verifyToken, createPost);
router.put("/update/:postId/:userId", verifyToken, updatePost);
router.get("/posts", getPosts);
router.delete("/delete/:postId/:userId", verifyToken, deletePost);

export default router;
