import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="my-2 bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex gap-3 items-center">
        {/* Avatar */}
        <Avatar className="w-12 h-12 bg-white border border-gray-500">
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback className="text-gray-900 font-bold">
            CN
          </AvatarFallback>
        </Avatar>

        {/* Username and Comment Text */}
        <div>
          <h1 className="font-bold text-base text-white">
            {comment?.author.username}
          </h1>
          <p className="font-normal text-sm text-gray-300">{comment?.text}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
