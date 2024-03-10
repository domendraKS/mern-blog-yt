import UserModel from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.handler.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  //if anyone is blank
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  //if email is already exist
  const dEmail = await UserModel.findOne({ email });
  if (dEmail) {
    return next(errorHandler(400, "This email is already registered."));
  }

  //if username is already exist
  const dUser = await UserModel.findOne({ username });
  if (dUser) {
    return next(errorHandler(400, "This username is already registered."));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new UserModel({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return res.status(201).json({
      success: true,
      message: "Signup Successfully.",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};
