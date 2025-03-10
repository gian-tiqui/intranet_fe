import React from "react";
import MotionTemplate from "./animation/MotionTemplate";
import GlobalSearch from "./GlobalSearch";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

const Welcome = () => {
  const suggestions: { title: string; path: string; icon?: string }[] = [
    { title: "General Bulletin", path: "/bulletin", icon: "gridicons:posts" },
    {
      title: "View History",
      path: "/history",
      icon: "material-symbols:history",
    },
    {
      title: "Your Department's posts",
      path: "/departments-memo",
      icon: "arcticons:emoji-department-store",
    },
    // {
    //   title: "Posts for your employee level",
    //   path: "/for-you",
    //   icon: "icon-park-outline:file-staff",
    // },
  ];

  return (
    <MotionTemplate>
      <div className="pt-20 flex flex-col items-center mb-10  sm:mx-7 lg:mx-0">
        <p className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-500">
          Hello there! 👋
        </p>
        <p className="text-lg font-semibold mb-32 ">
          Welcome back to WMC Employee Portal! What would you like to do?
        </p>
        <GlobalSearch />
        <div className="flex justify-center flex-wrap p-4 w-full gap-2">
          {suggestions.map((suggestion, index) => (
            <Link
              key={index}
              href={suggestion.path}
              className="px-3 h-10 flex items-center gap-1 bg-white dark:bg-neutral-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              {suggestion.icon && (
                <Icon icon={suggestion.icon} className="h-6 w-6" />
              )}
              {suggestion.title}
            </Link>
          ))}
        </div>
      </div>
    </MotionTemplate>
  );
};

export default Welcome;
