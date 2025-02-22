import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsOfPost,
  getCreatersPost,
  likePost,
} from "../controllers/post.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import express from "express";
import multer from "multer";
const router = express.Router();
router
  .route("/addpost")
  .post(isAuthenticated, upload.single("image"), addNewPost);
router.get("/allpost", isAuthenticated, getAllPost);
router.get("/userpost", isAuthenticated, getCreatersPost);
router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.post("/:id/comment", isAuthenticated, addComment);
router.post("/:id/comment/allcomment", isAuthenticated, getCommentsOfPost);
router.delete("/deletepost/:id", isAuthenticated, deletePost);
router.get("/:id/bookmark", isAuthenticated, bookmarkPost);
export default router;
