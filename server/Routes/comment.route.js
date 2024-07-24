import express from "express";
import {
  createComment,
  getPostComments,
  likeComment,
} from "../Controllers/comment.controller.js";
import { verifyUser } from "./../utils/verifyUser.js";

const commentRoute = express.Router();

commentRoute.post("/create", verifyUser, createComment);
commentRoute.get("/getPostComments/:postId", getPostComments);
commentRoute.put("/likeComment/:commentId", verifyUser, likeComment);

export default commentRoute;
