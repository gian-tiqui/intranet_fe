import React from "react";

const PostGridSkeleton = () => {
  return (
    <div className="w-full grid gap-1">
      <div className="h-8 mb-2 w-[25%] bg-gray-300 animate-pulse"></div>

      <div className="grid md:grid-cols-3 gap-1 mb-12">
        <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
          <div className="h-full w-full bg-gray-300 animate-pulse"></div>
        </div>
        <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
          <div className="h-full w-full bg-gray-300 animate-pulse"></div>
        </div>
        <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
          <div className="h-full w-full bg-gray-300 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default PostGridSkeleton;
