import express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createPost } from "../Controllers/post.controller.js";

const postRoute = express.Router();

postRoute.post("/create-post", verifyUser, createPost);

export default postRoute;
