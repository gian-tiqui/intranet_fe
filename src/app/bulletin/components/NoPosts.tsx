import React from "react";

const NoPosts = () => {
  return (
    <div className="h-52 w-full grid place-content-center">
      <p className="text-lg font-semibold px-20 py-7 shadow bg-white dark:bg-neutral-900 rounded-lg">
        No posts yet.
      </p>
    </div>
  );
};

export default NoPosts;
