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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.likes.push(req.user.id);
      comment.numberOfLikes += 1;
    } else {
      comment.likes.splice(userIndex, 1);
      comment.numberOfLikes -= 1;
    }

    await comment.save();

    return res.status(200).json({
      success: true,
      message: userIndex === -1 ? "Comment liked" : "Like removed",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandler(401, "You are not edit this comment"));
    }

    const updatedComment = await CommentModel.findByIdAndUpdate(
      req.params.commentId,
      {
        $set: {
          content: req.body.content,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await CommentModel.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    if (req.user._id !== comment.userId && !req.user.isAdmin) {
      return next(
        errorHandler(401, "You are not allowed to delete this comment.")
      );
    }

    await CommentModel.findByIdAndDelete(req.params.commentId);

    return res
      .status(200)
      .json({ success: true, message: "Comment successfully deleted" });
  } catch (error) {
    return next(error);
  }
};
