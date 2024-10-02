import MotionTemplate from "@/app/components/animation/MotionTemplate";
import React from "react";

const PostListSkeleton = () => {
  return (
    <MotionTemplate>
      <div className="px-3 mb-8">
        <div className="flex flex-col gap-1">
          <div className="bg-gray-400 h-4 w-2/4 mb-1"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
        </div>
      </div>

      <div className="px-3 mb-8">
        <div className="flex flex-col gap-1">
          <div className="bg-gray-400 h-4 w-2/4 mb-1"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
        </div>
      </div>

      <div className="px-3 mb-8">
        <div className="flex flex-col gap-1">
          <div className="bg-gray-400 h-4 w-2/4 mb-1"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
          <div className="bg-gray-400 h-4 w-full"></div>
        </div>
      </div>
    </MotionTemplate>
  );
};

export default PostListSkeleton;
