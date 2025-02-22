import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { readFileAsDataURL } from "@/lib/utils.js";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import Posts from "./Posts";
import store from "@/redux/store";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setFilePreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append("caption", caption);

    // Append the file as an image
    if (file) {
      formData.append("image", file);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://social-media-app-8too.onrender.com/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...posts])); // add new post from existing post
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-gray-800 rounded-lg p-6 max-w-lg mx-auto"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className="text-center font-semibold text-white">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="image" />
            <AvatarFallback className="bg-gray-700">CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-white text-sm">
              {user?.username}
            </h1>
            <span className="text-gray-300 text-xs">Bio here...</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none mt-4 w-full p-3 rounded-md bg-gray-700 text-white"
          placeholder="Write a caption ..."
        />
        {filePreview && (
          <div className="w-full h-64 flex items-center justify-center mt-4">
            <img
              src={filePreview}
              alt="preview_image"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          accept="image/*" // Accept only images
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#42adf4] mt-4"
        >
          Select from computer
        </Button>
        {filePreview &&
          (loading ? (
            <Button disabled className="mt-4 w-full bg-gray-600 text-white">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="mt-4 w-full bg-[#0095F6] hover:bg-[#42adf4]"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
