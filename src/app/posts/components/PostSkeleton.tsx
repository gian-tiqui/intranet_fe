import React from "react";

const PostSkeleton = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 bg-gray-400 rounded-full animate-pulse"></div>
        <div className="w-72 h-4 bg-gray-400 animate-pulse"></div>
      </div>

      <div className="w-44 h-4 bg-gray-400 animate-pulse mb-1"></div>
      <div className="w-32 h-4 bg-gray-400 animate-pulse mb-2"></div>

      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-2" />

      <div className="w-full h-4 bg-gray-400 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-400 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-400 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-400 animate-pulse mb-1"></div>
      <div className="w-full h-4 bg-gray-400 animate-pulse mb-7"></div>

      <div className="h-96 w-full bg-gray-400 animate-pulse mb-6"></div>
    </div>
  );
};

export default PostSkeleton;
