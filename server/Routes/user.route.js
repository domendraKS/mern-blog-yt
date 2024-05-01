import express from "express";
import {
  deleteUser,
  getUser,
  updateUser,
} from "../Controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const userRoute = express.Router();

userRoute.get("/getUser/:userId", getUser);
userRoute.put("/update/:userId", verifyUser, updateUser);
userRoute.delete("/delete/:userId", verifyUser, deleteUser);

export default userRoute;
