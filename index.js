import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import { loginValidation, registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as AuthController from "./controller/AuthController.js";
import * as PostController from "./controller/PostController.js";
import { postCreateValidation } from "./validations/post.js";
import handleValidation from "./middleware/handleValidation.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

mongoose
  .connect("mongodb://127.0.0.1:27017/react-blog")
  .then(() => console.log("DB ok!"))
  .catch((err) => console.log("DB error!", err));

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Vladislav Urchenko!");
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.filename}`,
    file: req.file,
  });
});

app.post(
  "/auth/login",
  loginValidation,
  handleValidation,
  AuthController.login
);
app.post(
  "/auth/register",
  registerValidation,
  handleValidation,
  AuthController.register
);
app.get("/auth/me", checkAuth, AuthController.getMe);

app.get("/tags", PostController.getLastTags);
app.get("/posts", PostController.index);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidation,
  PostController.create
);
app.get("/posts/:id", PostController.show);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidation,
  PostController.update
);
app.delete("/posts/:id", checkAuth, PostController.destroy);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`App listing on port ${port}`);
});
