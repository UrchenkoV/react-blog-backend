import mongoose from "mongoose";

const PostModel = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    image: String,

    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

PostModel.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

PostModel.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  count: true,
});

PostModel.set("toObject", { virtuals: true });
PostModel.set("toJSON", { virtuals: true });

export default mongoose.model("Post", PostModel);
