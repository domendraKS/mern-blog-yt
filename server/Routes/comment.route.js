import express from "express";
import {
  createComment,
  editComment,
  getPostComments,
  likeComment,
} from "../Controllers/comment.controller.js";
import { verifyUser } from "./../utils/verifyUser.js";

const commentRoute = express.Router();

commentRoute.post("/create", verifyUser, createComment);
commentRoute.get("/getPostComments/:postId", getPostComments);
commentRoute.put("/likeComment/:commentId", verifyUser, likeComment);
commentRoute.put("/editComment/:commentId", verifyUser, editComment);

export default commentRoute;
