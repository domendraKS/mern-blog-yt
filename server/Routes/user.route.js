import express from "express";
import { getUser, updateUser } from "../Controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const userRoute = express.Router();

userRoute.get("/getUser/:userId", getUser);
userRoute.put("/update/:userId", verifyUser, updateUser);

export default userRoute;
