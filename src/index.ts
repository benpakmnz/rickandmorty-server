import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONOGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected");
  } catch (err) {
    console.log(err);
  }

  app.listen(process.env.PORT || 5004, function () {
    console.log(`App listening on port: ${process.env.PORT || 5004}`);
  });
};

start();
