import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const PostSkeleton = () => {
  return (
    <div>
      <div className="flex items-start gap-2 mb-3">
        <div className="h-9 w-9 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-44 h-4 bg-gray-300 animate-pulse"></div>
      </div>

      <div className="w-44 h-4 bg-gray-300 animate-pulse mb-1"></div>
      <div className="w-32 h-4 bg-gray-300 animate-pulse mb-2"></div>

      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-2" />

      <div className="w-full h-4 bg-gray-300 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-300 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-300 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-300 animate-pulse mb-1"></div>
      <div className="w-96 h-4 bg-gray-300 animate-pulse mb-7"></div>

      <div className="h-96 w-full bg-gray-300 animate-pulse mb-6"></div>
      <div className="flex flex-grow w-full mb-6">
        <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2 animate-pulse">
          <Icon icon={"mdi:like-outline"} className="h-6 w-6" />
          <p className="cursor-pointer">Like</p>
        </div>
        <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2 animate-pulse">
          <Icon icon={"material-symbols:comment-outline"} className="h-6 w-6" />

          <p className="text-center cursor-pointer">Comment</p>
        </div>
        <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2 animate-pulse">
          <Icon icon={"fluent-mdl2:share"} className="h-6 w-6" />

          <p className="text-end cursor-pointer">Share</p>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
