import CommentModel from "../Models/comment.model.js";
import { errorHandler } from "../utils/error.handler.js";

//Create post comments
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

//get all comments through the postId
export const getPostComments = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const comments = await CommentModel.find({ postId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Get All comments successfully",
      comments,
    });
  } catch (error) {
    next(error);
  }
};
