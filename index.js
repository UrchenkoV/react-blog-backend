import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import { loginValidation, registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as AuthController from "./controller/AuthController.js";
import * as PostController from "./controller/PostController.js";
import * as CommentController from "./controller/CommentController.js";
import { postCreateValidation } from "./validations/post.js";
import { commentCreateValidation } from "./validations/comment.js";
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
// Posts
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

// Comments
app.get("/comments", CommentController.index);
app.post(
  "/posts/:id/comment",
  checkAuth,
  commentCreateValidation,
  handleValidation,
  CommentController.create
);
app.patch(
  "/comments/:id",
  checkAuth,
  commentCreateValidation,
  handleValidation,
  CommentController.update
);
app.patch("/comments/:id", checkAuth, CommentController.destroy);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log(`App listing on port ${port}`);
});
