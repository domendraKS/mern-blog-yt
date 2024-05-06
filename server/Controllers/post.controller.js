import PostModel from "../Models/post.model.js";
import { errorHandler } from "../utils/error.handler.js";

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the required fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, "");

  const newPost = new PostModel({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    return res
      .status(201)
      .json({ success: true, message: "Post Created Successfully", savedPost });
  } catch (error) {
    next(error);
  }
};
