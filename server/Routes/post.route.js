import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createPost, getAllPosts } from "../Controllers/post.controller.js";

const postRoute = express.Router();

postRoute.post("/create-post", verifyUser, createPost);
postRoute.get("/getAll-posts", getAllPosts);

export default postRoute;
