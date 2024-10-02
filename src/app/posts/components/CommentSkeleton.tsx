import React from "react";

const CommentSkeleton = () => {
  return (
    <div>
      <div className="flex gap-6 mb-6">
        <div className="h-10 w-10 bg-white rounded-full animate-pulse"></div>
        <div className="max-w-[85%] mt-1">
          <div className="h-6 w-52 bg-gray-400 animate-pulse"></div>
          <div className="mb-1 flex flex-col gap-1 mt-1">
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="h-10 w-10 bg-white rounded-full animate-pulse"></div>
        <div className="max-w-[85%] mt-1">
          <div className="h-6 w-52 bg-gray-400 animate-pulse"></div>
          <div className="mb-1 flex flex-col gap-1 mt-1">
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
            <div className="h-6 w-96 bg-gray-400 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
