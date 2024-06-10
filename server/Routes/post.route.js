import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import {
  createPost,
  deletePost,
  getAllPosts,
} from "../Controllers/post.controller.js";

const postRoute = express.Router();

postRoute.post("/create-post", verifyUser, createPost);
postRoute.get("/getAll-posts", getAllPosts);
postRoute.delete("/deletePost/:postId/:userId", verifyUser, deletePost);

export default postRoute;
