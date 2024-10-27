import React from "react";

const Shortcuts = () => {
  return (
    <div className="flex flex-wrap my-12 gap-2">
      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">A - Z</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Most Viewed</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Least Viewed</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Latest</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Oldest</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">First Page</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Previous Page</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Next Page</p>
      </div>

      <div className="rounded-full px-3 py-2 cursor-pointer  dark:hover:bg-neutral-700 bg-white hover:bg-gray-100 dark:bg-neutral-900">
        <p className="text-sm font-bold">Last Page</p>
      </div>
    </div>
  );
};

export default Shortcuts;
