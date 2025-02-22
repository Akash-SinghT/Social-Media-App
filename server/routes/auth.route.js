import express from "express";
import {
  signup,
  login,
  logout,
  editProfile,
  getProfile,
  getSuggestedUSers,
  followOrUnfollow,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

router.get("/logout", logout);
router.get("/:id/profile", isAuthenticated, getProfile); // will get profile by id
router.post(
  "/profile/editprofile",
  isAuthenticated,
  upload.single("profilePhoto"), // use multer middleware to up load image on cloud like single image
  editProfile
);
router.get("/suggested", isAuthenticated, getSuggestedUSers);
router.post("/followorunfollow/:id", isAuthenticated, followOrUnfollow); // will need id to do that

export default router;
