import UserModel from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.handler.js";
import jwt from "jsonwebtoken";

//Sign up
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
    return next(errorHandler(400, "All fields are required"));
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
      user: newUser,
    });
  } catch (error) {
    return next(error);
  }
};

//Sing in
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await UserModel.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);

    //send valid user data without password
    const { password: hashedPassword, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        success: true,
        message: "Successfully login",
        user: rest,
      });
  } catch (error) {
    return next(error);
  }
};
