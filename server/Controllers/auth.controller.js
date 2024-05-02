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

  //check correct username
  if (username) {
    if (username.length < 6 || username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 6 to 20 character")
      );
    }

    if (username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }

    if (username.toLowerCase() !== username) {
      return next(errorHandler(400, "Username must be lowercase"));
    }

    if (!username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }

  //if password must be 6 character
  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 character"));
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

//google authentication
export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const validUser = await UserModel.findOne({ email });

    if (validUser) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
      const { password, ...rest } = validUser._doc;

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({ success: true, message: "Successfully login", user: rest });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatePassword, 10);

      const newUser = await UserModel({
        username: name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
      const { password, ...rest } = newUser._doc;

      return res
        .status(201)
        .cookie("access_token", token, { httpOnly: true })
        .json({ success: true, message: "Successfully signup", user: rest });
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // const cookiesWithName = req.headers.cookie;
    // const cookies = cookiesWithName.split(";").reduce((cookiesObj, cookie) => {
    //   const [name, value] = cookie.trim().split("=");
    //   cookiesObj[name] = value;
    //   return cookiesObj;
    // }, {});

    // const token = cookies.access_token;

    return res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User has been signed out" });
  } catch (error) {
    next(error);
  }
};
