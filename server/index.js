import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoute from "./Routes/user.route.js";

const app = express();

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

app.use("/api/user", userRoute);
