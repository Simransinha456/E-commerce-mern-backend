import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import cors from "cors";
// import { productRoute } from "./src/routes/productRoute.js";
// import { productRoute } from "../server/src/routes/productRoute.js";
import { productRoute } from "./src/routes/productRoute.js";
// import {userRoute} from "../server/src/routes/userRoute.js"
import {userRoute} from "./src/routes/userRoute.js"

env.config();
const app = express();
 
app.use(express.json());
app.use(cors()); // using this our react app connect with port 8000
const mongoUrl = process.env.MONGO_URL;
const connect = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
connect();

//API creation
app.get("/", (req, res) => {
  res.send("Express app is running");
});

//Image storage engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
//using multer we create one upload folder
const upload = multer({ storage: storage });

// creating upload endpoint for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${8000}/images/${req.file.filename}`,
  });
});

//Routing page of productRoute and userRoute
app.use("/newproduct", productRoute);
app.use("/newuser", userRoute);



app.listen(8000, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    return;
  }
  console.log("Server started at 8000");
});
