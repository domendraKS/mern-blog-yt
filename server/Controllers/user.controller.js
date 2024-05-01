import UserModel from "../Models/user.model.js";
import { errorHandler } from "../utils/error.handler.js";
import bcryptjs from "bcryptjs";

export const getUser = (req, res) => {
  return res.json({ message: "Get users" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update the user"));
  }

  if (req.body.username) {
    if (req.body.username.length < 6 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 6 to 20 character")
      );
    }

    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    if (req.body.username.toLowerCase() !== req.body.username) {
      return next(errorHandler(400, "Username must be lowercase"));
    }

    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  if (req.body.password) {
    if (req.body.password.trim() === "") {
      return next(errorHandler(400, "Password cannot be empty"));
    }

    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 character"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    return res.status(200).json({
      success: true,
      message: "User's Profile Updated Successfully",
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};
