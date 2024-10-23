import React from "react";

const PostGridSkeleton = () => {
  return (
    <div className="w-full grid gap-1">
      <p className="text-lg font-bold mb-6">Latest public memos</p>
      <div className="grid md:grid-cols-3 gap-1">
        <div className="max-h-82 w-full md:col-span-2 bg-white dark:bg-neutral-900 shadow">
          <div className="h-full w-full bg-gray-300 animate-pulse"></div>
        </div>
        <div className="md:col-span-1 grid grid-cols-1 gap-1">
          <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
            <div className="h-full w-full bg-gray-300 animate-pulse"></div>
          </div>
          <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
            <div className="h-full w-full bg-gray-300 animate-pulse"></div>
          </div>
        </div>
      </div>
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
