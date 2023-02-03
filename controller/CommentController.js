import CommentModel from "../models/Comment.js";

export const index = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .sort({ createdAt: "desc" })
      .populate("user")
      .limit(5)
      .exec();
    //
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Произошла ошибка.",
    });
  }
};

export const show = () => {};

export const create = async (req, res) => {
  try {
    const body = req.body;

    const comment = await CommentModel.create({
      user: req.userId,
      post: req.params.id,
      text: body.text,
    });

    comment.save(async (err, item) => {
      const data = await item.populate("user");
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Произошла ошибка.",
    });
  }
};

export const update = () => {};

export const destroy = () => {};
