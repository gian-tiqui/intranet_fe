import { Skeleton } from "primereact/skeleton";
import React, { useEffect, useState } from "react";

const FolderGridSkeleton = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return a simple loading state until mounted
  if (!mounted) {
    return (
      <div className="pt-5">
        <div className="flex justify-end gap-2 mb-5">
          <div className="bg-gray-300 mb-2 w-52 h-10 rounded"></div>
          <div className="bg-gray-300 mb-2 w-36 h-10 rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-300 mb-6 w-7 h-7 rounded"></div>
          <div className="bg-gray-300 mb-6 w-52 h-7 rounded"></div>
        </div>
        <div className="min-h-96 grid grid-cols-3 gap-2 items-start content-start">
          {Array(19)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-gray-300 h-10 rounded"></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5" suppressHydrationWarning>
      <div>
        <div className="flex justify-end gap-2 mb-5">
          <Skeleton className="bg-gray-300 mb-2 !w-52 !h-10"></Skeleton>
          <Skeleton className="bg-gray-300 mb-2 !w-36 !h-10"></Skeleton>
        </div>

        <div className="flex gap-2">
          <Skeleton className="bg-gray-300 mb-6 !w-7 !h-7"></Skeleton>
          <Skeleton className="bg-gray-300 mb-6 !w-52 !h-7"></Skeleton>
        </div>

        <div className="min-h-96 grid grid-cols-3 gap-2 items-start content-start">
          {Array(19)
            .fill(0)
            .map((_, index) => (
              <Skeleton key={index} className="bg-gray-300 !h-10"></Skeleton>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FolderGridSkeleton;
