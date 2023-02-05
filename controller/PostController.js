import PostModel from "../models/Post.js";
import fs from "fs";

export const index = async (req, res) => {
  try {
    const query = req.query;
    let post = null;

    if (query.populate) {
      post = await PostModel.find()
        .sort({ viewsCount: query.populate })
        .populate({ path: "commentCount" })
        .populate({ path: "user", select: "fullName avatar" })
        .exec();
    } else if (query.tag) {
      post = await PostModel.find()
        .where("tags", query.tag)
        .populate({ path: "commentCount" })
        .populate({ path: "user", select: "fullName avatar" })
        .exec();
    } else {
      post = await PostModel.find()
        .populate({ path: "commentCount" })
        .populate({ path: "user", select: "fullName avatar" })
        .exec();
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при получении статей.",
    });
  }
};

export const show = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findByIdAndUpdate(
      { _id: postId },
      {
        $inc: { viewsCount: 1 },
      },
      { new: true }
    )
      .populate({ path: "user", select: "fullName avatar" })
      .populate({ path: "comments", populate: "user" })
      .populate({ path: "commentCount" });

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена.",
      });
    }

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при получении статьи.",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      user: req.userId,
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      image: req.body.image,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при создании статьи.",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        image: req.body.image,
        tags: req.body.tags,
        user: req.userId,
      }
    );

    if (!post) {
      console.log(post);
      return res.status(404).json({
        message: "Статья не найдена.",
      });
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Произошла ошибка.",
    });
  }
};

export const destroy = async (req, res) => {
  try {
    const postId = req.params.id;
    const appDir = process.cwd();

    const post = await PostModel.findOneAndDelete({
      _id: postId,
    });

    if (!post) {
      return res.status(404).json({
        message: "Статья не найдена.",
      });
    }

    await fs.unlink(appDir + post.image, (err) => {
      console.log("Error on delete image post.", err);
    });

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Произошла ошибка.",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const post = await PostModel.find().exec();
    const tags = await [...new Set(post.map((obj) => obj.tags).flat())];

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Ошибка при получении статей.",
    });
  }
};
