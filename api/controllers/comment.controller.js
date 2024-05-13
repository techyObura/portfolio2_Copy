import { response } from "express";
import errorHandler from "../middleware/errorHandler.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  const { content, userId, postId } = req.body;

  if (userId !== req.user.id) {
    return next(errorHandler(403, "You do not have permission to comment"));
  }

  try {
    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error.message);
  }
};

export const getComment = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(500, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    console.log(userIndex);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error.message);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(500, "Comment not found"));
    }

    if (comment.userId !== req.user.id || !req.user.isAdmin) {
      return next(
        errorHandler(500, "You do not have permission to complete this request")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { content: req.body.content },
      { new: true }
    );

    res.status(200).json(editedComment);
  } catch (error) {
    next(error.message);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(500, "Comment not found"));
    }

    if (comment.userId !== req.user.id || !req.user.isAdmin) {
      return next(
        errorHandler(500, "You are not allowed to delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully");
  } catch (error) {
    next(error.message);
  }
};

//route to get all comments but not working so not used here
export const allComments = async (req, res, next) => {
  console.log("first comment");
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
};
