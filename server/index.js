import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./Routes/user.route.js";
import authRoute from "./Routes/auth.route.js";

const app = express();
app.use(express.json());

const URL = process.env.DB_URI;
const PORT = process.env.SERVER_PORT;

const DB_CONN = () => {
  mongoose
    .connect(URL)
    .then((res) => {
      console.log("MongoDB is connected.");
    })
    .catch((error) => {
      console.log(error);
    });
};

app.listen(PORT, () => {
  DB_CONN();
  console.log(`Server is running on port ${PORT}`);
});

//Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

//error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({ success: false, statusCode, message });
});
