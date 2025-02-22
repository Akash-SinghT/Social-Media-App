import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";
import getDatauri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // ✅ Generate Token
    generateToken(user._id, res);

    // ✅ Retrieve User Posts (Initially, new users have no posts)
    const userPosts = [];

    // ✅ Format User Response
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || "",
      bio: user.bio || "",
      followers: [],
      following: [],
      posts: userPosts,
    };

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.log("Error in sign up:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    generateToken(user._id, res);

    // populate each post id in the posts array so when he login he can able to see the posts
    const populatedPost = await Promise.all(
      // Loop through all the post IDs for the user
      user.posts.map(async (postId) => {
        // Find the post by ID asynchronously
        const post = await Post.findById(postId); // Await the result of the query  postId is identifier

        // Check if the post's author is the logged-in user
        if (post && post.author.equals(user._id)) {
          // Only return posts by the logged-in user
          return post;
        }
        return null; // Return null for posts that don't belong to the logged-in user
      })
    );

    // Filter out null values (posts that don't belong to the user)
    const userPosts = populatedPost.filter((post) => post !== null);

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: userPosts,
    };
    return res.status(200).json({
      success: true,
      message: "Logged in successful",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      // delete cookie by passing empty token
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log("Error in Logout", error);
    return res.status(401).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  // we will get anyone's profile by its's local id
  try {
    const userId = req.params.id; // get user id
    let user = await User.findById(userId)
      .populate({
        path: "posts",
        createdAt: -1,
      })
      .populate("bookmarks"); //find user and return user
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const editProfile = async (req, res) => {
  //get user id of logged in user
  try {
    const userId = req.id;
    //console.log(userId); // from authAuthentication by verifying token
    const { bio, gender } = req.body;
    const profilePicture = req.file; // get from file as we do request in frontend from files
    let cloudResponse;

    // we have to create a method to get Data uri
    if (profilePicture) {
      const fileUri = getDatauri(profilePicture); /// that will give uri of that picture
      cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: process.env.FOLDER_NAME, // Specify a folder for profile pictures
        resource_type: "image", // Explicitly specify the resource type
      }); // upload to cloud
    }
    const user = await User.findById(userId).select("-password"); // check user exist

    if (!user) {
      return res.status(401).json({
        message: " User Not Found",
        success: false,
      });
    }
    if (bio) user.bio = bio; // if bio update it
    if (gender) user.gender = gender; // if gender
    if (profilePicture) user.profilePicture = cloudResponse.secure_url; // if  picture
    await user.save(); // save changes

    return res.status(200).json({
      message: "Profile Updated",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getSuggestedUSers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }) // will get the get users whose id not equal to mine
      .select("-password"); // leaving password by selecting it rest all i need

    if (!suggestedUsers) {
      // check if there
      return res.status(401).json({
        message: " Currently do not have any users",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers, // return suggested users
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id; // Logged-in user's ID
    const jiskoFollowKarunga = req.params.id; // Target user's ID

    // Prevent self-following
    if (String(followKrneWala) === String(jiskoFollowKarunga)) {
      return res.status(400).json({
        message: "You cannot follow or unfollow yourself",
        success: false,
      });
    }

    // Find users in the database
    const user = await User.findById(followKrneWala); // meri id
    const targetUser = await User.findById(jiskoFollowKarunga); // uski id target
    // Check if users exist
    if (!user || !targetUser) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const isFollowing = user.following.includes(jiskoFollowKarunga); // will check if i am already following or not in that array
    if (isFollowing) {
      // ager hai to Unfollow Logic
      await Promise.all([
        // when multiple document handled at once we use promise to do that
        User.updateOne(
          { _id: followKrneWala }, // going inside my id and removing 2nd person id from my following array
          { $pull: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga }, // going inside 2nd person id and pulling my id to  his followers array
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      // follow kr lo
      await Promise.all([
        // when multiple document handled at once we use promise to do that
        User.updateOne(
          { _id: followKrneWala }, // going inside my id and pushing 2nd person id to my following array
          { $push: { following: jiskoFollowKarunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKarunga }, // going inside 2nd person id and pushing my id to  his followers array
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res.status(200).json({
        message: "follow successfully",
        success: true,
      });
    }
  } catch (error) {
    console.error("Error in followOrUnfollow:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
