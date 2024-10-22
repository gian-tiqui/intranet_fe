import React from "react";

const HistorySkeleton = () => {
  return (
    <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg shadow mt-1 mb-2">
      <div className="w-full h-56 bg-gray-300 animate-pulse mb-2"></div>
      <div className="w-1/6 h-4 bg-gray-300 animate-pulse rounded-full mb-2"></div>
      <div className="w-full h-4 bg-gray-300 animate-pulse rounded-full mb-2"></div>
      <div className="w-full h-4 bg-gray-300 animate-pulse rounded-full mb-2"></div>
      <div className="w-2/3 h-4 bg-gray-300 animate-pulse rounded-full mb-7"></div>

      <div className="w-full flex justify-between items-center">
        <div className="w-1/4 h-4 bg-gray-300 animate-pulse rounded-full mb-2"></div>
        <div className="w-1/12 h-4 bg-gray-300 animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

export default HistorySkeleton;
