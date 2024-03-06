import express from "express";
import { getUser } from "../Controllers/user.controller.js";

const userRoute = express.Router();

userRoute.get("/getUser", getUser);

export default userRoute;
