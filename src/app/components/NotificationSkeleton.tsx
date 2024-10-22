import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const NotificationSkeleton = () => {
  return (
    <div className="border w-full p-2 bg-white dark:bg-neutral-900 dark:border-black rounded-lg text-sm  cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800">
      <Icon icon={`akar-icons:info`} className="h-5 w-5 mb-1" />
      <div className="h-3 w-full bg-gray-200 animate-pulse mb-2 rounded-full"></div>
      <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded-full"></div>
    </div>
  );
};

export default NotificationSkeleton;
