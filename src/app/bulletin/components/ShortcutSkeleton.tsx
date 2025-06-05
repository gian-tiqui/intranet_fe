import React from "react";

const ShortcutSkeleton = () => {
  return (
    <div className="flex gap-2 items-center mb-8 mt-14 max-w-[80%] w-full mx-auto">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div
            className="rounded-full bg-gray-400 animate-pulse h-8 w-20"
            key={index}
          ></div>
        ))}
    </div>
  );
};

export default ShortcutSkeleton;
