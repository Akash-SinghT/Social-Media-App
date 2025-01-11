import sharp from "sharp";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import multer from "multer";
import cloudinary from "cloudinary";
export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Image required" });

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // buffer to data uri
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });
    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // to get post in sorted order as time
      .populate({ path: "author", select: "username profilePicture" }) // get author name and profilePicture from Post
      .populate({
        path: "comments", // go inside comment
        sort: { createdAt: -1 }, // sort it with time
        populate: {
          path: "author", // got inside author in comment schema
          select: "username profilePicture", // get  userprofile and and name from User
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log("Error getting post:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
// get all my post

export const getCreatersPost = async (req, res) => {
  try {
    const authorId = req.id; // mine as login iam login
    const posts = await Post.find({ author: authorId }) // post ke ander jo author hai aur jo id aa rahi hai wo match kr rahi to matlab wo creater ki hi id hogi
      .sort({
        createdAt: "-1",
      })
      .populate({
        path: "author", // get from inside author
        select: "username profilePicture",
      })
      .populate({
        Path: "comments", // go inside comment
        sort: { createdAt: -1 }, // sort it with time
        populate: {
          path: "author", // got inside author in comment schema
          select: "username profilePicture", // get userprofile and and name from User
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const likePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id; // get user
    const postId = req.params.id; // get post id
    const post = await Post.findById(postId); // find it
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: true,
      });
    }
    // like post logic
    await post.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } }); // post me jake  likes array me  ek add kr do
    await post.save();
    // Implement socket io for real time notification
    return res.status(200).json({
      message: "Post liked",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const likeKrneWalaUserKiId = req.id; // get user
    const postId = req.params.id; // get post id
    const post = await Post.findById(postId); // find it
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: true,
      });
    }
    // like post logic
    await post.updateOne({ $pull: { likes: likeKrneWalaUserKiId } }); // post me jake  likes array me  ek kam kr do
    await post.save();
    // Implement socket io for real time notification
    return res.status(200).json({
      message: "Post Unliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", sucess: false });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id; // get postId
    const commentkrneWalaUserKiId = req.id; // get userid
    const { text } = req.body; // get text
    const post = await Post.findById(postId); // post is there or not
    if (!text)
      return res.status(400).json({
        message: "text is required",
        success: false,
      });
    const comment = await Comment.create({
      // create comment
      // create comment
      text,
      author: commentkrneWalaUserKiId,
      post: postId,
    });
    await comment.populate({
      // add comment
      path: "author",
      select: "username profilePicture",
    });
    post.comments.push(comment._id); // inside post we are pushing comment id
    await post.save();

    return res.status(200).json({
      comment,
      message: "Comment added",
      success: true,
    });
  } catch (error) {
    console.log("Error creating post:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id; // get postId
    const comments = await Comment.find({ post: postId }).populate(
      //find cooment according to post and get uername and profilepicture
      "author",
      "username, profilePicture"
    );
    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found", success: false });
    return res.satus(200).json({
      // return comments
      succes: true,
      comments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", sucess: false });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id; // get post id
    const authorId = req.id; // logged in user
    const post = await Post.findById(postId); // find post
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    // check if the logged in user is the owner of the post

    if (post.author.toString() !== authorId) {
      //post.author This is assumed to be an ObjectId (from MongoDB) representing the author's ID in the Post document
      // get id of autor inside post and convert it to string as it is there in object form
      return res.status(403).json({ message: "Unauthorized" });
      // Delette Post
    }
    await Post.findByIdAndDelete(postId); // delete from post model

    // remove the postId from user's post section aswell
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId); // mereko wo saari post chahiye jo is post id ke equal nahi hai from posts array
    await user.save();

    // Delete associated comments

    await Comment.deleteMany({ post: postId }); //comment ke ander post ko match karo postId match hoti hai to sare comment use hata do
    return res.status(200).json({
      message: "Post deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id; // get post id
    const authorId = req.id; // user id
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found", success: false });

    const user = await User.findById(authorId); // find user
    if (user.bookmarks.includes(post._id)) {
      // check in bookmark array if it there remove it
      await user.updateOne({ $pull: { bookmarks: post._id } }); // remove that post id ffrom bookmarks array
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      // if not bookmark it
      if (user.bookmarks.includes(post._id)) {
        await user.updateOne({ $addToSet: { bookmarks: post._id } }); //  add it to array
        await user.save();
        return res.status(200).json({
          type: "Saved",
          message: "Post removed from bookmarked",
          success: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", sucess: false });
  }
};
