import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const logOutHandler = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.error.message);
    }
  };

  const sidebarHandler = (texttype) => {
    if (texttype === "Logout") {
      logOutHandler();
    } else if (texttype === "Create") {
      setOpen(true);
    }
  };
  const SideBarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback className="text-gray-900 font-bold">
            CN
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];
  return (
    <div className="fixed top-0 c-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col ">
        <h1 className="my-8 pl-8 font-bold text-xl">BONDLY</h1>
        <div>
          {SideBarItems.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                className="flex item center gap-3 relative hover:bg-gray-800 cursor-pointer rounded-lg p-3 m-3"
                key={index}
              >
                {item.icon}
                <span> {item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
