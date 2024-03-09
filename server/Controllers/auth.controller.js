import UserModel from "../Models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
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
    return res.status(400).json({ message: "All fields are required" });
  }

  //if email is already exist
  const dEmail = await UserModel.findOne({ email });
  if (dEmail) {
    return res.json({ message: "This email is already registered." });
  }

  //if username is already exist
  const dUser = await UserModel.findOne({ username });
  if (dUser) {
    return res.json({ message: "This username is already registered." });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new UserModel({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    return res.json({ message: "Signup Successfully.", newUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
