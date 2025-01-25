import React from "react";
import Posts from "./Posts";
import Feed from "./Feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback className="bg-gray-800">CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="font-semibold text-small">
            <Link to={`/profile/${user._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-white text-sm">
            {user?.Bio || "Bio here.."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
