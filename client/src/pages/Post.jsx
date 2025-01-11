import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false); // if user already like then ike array me already uski id padi hogi
  const dispatch = useDispatch();
  const [postLike, setPostLike] = useState(post.likes.length); // initial like count
  const [comment, setComment] = useState(post.comments); // thre is comment array inside post

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const likeordislikeHandler = async () => {
    // get post id
    try {
      const action = liked ? "dislike" : "like";
      const response = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/${action}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1; // like and dislike
        setPostLike(updatedLikes);
        setLiked(!liked); // set like if false come true and updatd
        // post update like or dislike
        const updatedPostData = posts.map(
          (p) =>
            p._id === post?._id // if likes post === post_id
              ? {
                  ...p, // baki sari post ki key value ko rakh raha hoon
                  likes: liked // keva likes wali ko update kr raha hoon
                    ? p.likes.filter((id) => id !== user?._id) // likes array me jakr agr user dislike karega to filter kr denge us user ki id ko
                    : [...p.likes, user._id], // ager ike kr raha hai to likes array me uski daa denge
                }
              : p // yaa keval post return kr denge
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/post/deletepost/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      //   console.log("Delete response:", response); // Debug log

      if (response.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* User Info Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="User Avatar" />
            <AvatarFallback className="bg-gray-800">CN</AvatarFallback>
          </Avatar>
          <h1 className="text-lg font-semibold">{post.author?.username}</h1>
        </div>
        {/* Options Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              aria-label="Options"
              className="cursor-pointer hover:opacity-80"
            >
              <MoreHorizontal />
            </button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center gap-2 text-sm text-center bg-gray-800 p-4 rounded-md">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to Favourites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        src={post.image}
        alt="A beautiful landscape"
        className="my-2 rounded-sm aspect-square w-full object-cover"
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeordislikeHandler}
              size={22}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={likeordislikeHandler}
              className="cursor-pointer hover:text-gray-600 transition-colors"
              size={22}
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post)); // add post in selectedPost so we can get
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600 transition-colors"
          />

          <Send className="cursor-pointer hover:text-gray-600 transition-colors" />
        </div>
        <button
          aria-label="Bookmark"
          className="cursor-pointer hover:text-gray-600 transition-colors"
        >
          <Bookmark />
        </button>
      </div>

      {/* Post Details */}
      <span className="font-medium block mb-2">{postLike} likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <button
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpen(true);
        }}
        className="cursor-pointer text-sm text-gray-400 hover:underline"
      >
        View all {comment.length} comments
      </button>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />

      {/* Add Comment Section */}
      <div className="flex items-center justify-between mt-2">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full bg-gray-900 rounded-sm p-2 text-white placeholder-gray-500"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] ml-2 font-medium  cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
