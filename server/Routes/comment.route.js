import express from "express";
import {
  createComment,
  getPostComments,
} from "../Controllers/comment.controller.js";
import { verifyUser } from "./../utils/verifyUser.js";

const commentRoute = express.Router();

commentRoute.post("/create", verifyUser, createComment);
commentRoute.get("/getPostComments/:postId", getPostComments);

export default commentRoute;
