import React from "react";
import MotionTemplate from "./animation/MotionTemplate";
import GlobalSearch from "./GlobalSearch";
import Link from "next/link";

const Welcome = () => {
  return (
    <MotionTemplate>
      <div className="pt-20 flex flex-col items-center mb-10">
        <p className="text-2xl font-bold mb-4">Hello there!</p>
        <p className="text-lg font-semibold mb-32">
          Welcome back to Intranet! What would you like to do?
        </p>
        <GlobalSearch />
        <div className="flex justify-center flex-wrap p-4 w-full gap-2">
          <Link
            href={"/bulletin"}
            className="px-3 h-10 grid place-content-center bg-white dark:bg-neutral-900 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            General Bulletin
          </Link>
          <Link
            href={"/department-memos"}
            className="px-3 h-10 grid place-content-center bg-white dark:bg-neutral-900 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            Department Bulletin
          </Link>
          <Link
            href={"/history"}
            className="px-3 h-10 grid place-content-center bg-white dark:bg-neutral-900 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            View History
          </Link>

          <Link
            href={"/for-you"}
            className="px-3 h-10 grid place-content-center bg-white dark:bg-neutral-900 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            Posts for you
          </Link>
        </div>
      </div>
    </MotionTemplate>
  );
};

export default Welcome;
