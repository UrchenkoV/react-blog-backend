import PostModel from "../models/Post.js";
import fs from "fs";

export const destroyImageFromPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const appDir = process.cwd();

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена.",
      });
    }

    fs.unlink(appDir + post.image, async (err) => {
      if (err) {
        console.log("Error on delete image from post", err);
        return res
          .status(500)
          .json({ message: "Не удалось удалить картинку." });
      }

      post.image = "";
      await post.save();

      res.json({
        message: "Картинка удалена.",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Произошла ошибка.",
    });
  }
};
