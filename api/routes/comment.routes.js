import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getComment,
  allComments,
  likeComment,
} from "../controllers/comment.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", verifyToken, createComment);
router.get("/:postId", getComment);
router.put("/likeComment/:commentId", verifyToken, likeComment);
router.put("/editComment/:commentId", verifyToken, editComment);
router.delete("/deleteComment/:commentId", verifyToken, deleteComment);
router.get("/getAllComments", allComments);

export default router;
