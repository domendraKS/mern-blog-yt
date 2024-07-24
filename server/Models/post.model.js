import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default:
        "https://www.google.com/imgres?q=blog%20post%20image&imgurl=https%3A%2F%2Fasset.inc42.com%2F2014%2F04%2Fwrite-a-great-blog-post.jpg&imgrefurl=https%3A%2F%2Finc42.com%2Fresources%2Fsecret-killer-blog-post%2F&docid=h292zqZYEntEgM&tbnid=nRFZb4djJgBkHM&vet=12ahUKEwiFrtadx_mFAxXWdfUHHS4XAcoQ9AF6BAhZEAA..i&w=1000&h=665&hcb=2&ved=2ahUKEwiFrtadx_mFAxXWdfUHHS4XAcoQ9AF6BAhZEAA",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;

// export default mongoose.model("Post", postSchema);
