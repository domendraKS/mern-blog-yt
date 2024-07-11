import CommentModel from "../Models/comment.model.js";
import { errorHandler } from "../utils/error.handler.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    const ccomment = content.trim();

    if (!content || !ccomment) {
      return next(errorHandler(400, "Comment field is requied"));
    }

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create the comment")
      );
    }

    const newComment = new CommentModel({
      content: ccomment,
      postId,
      userId,
    });

    const saveComment = await newComment.save();

    return res.status(201).json({
      success: true,
      message: "Comment is posted",
      comment: saveComment,
    });
  } catch (error) {
    next(error);
  }
};
