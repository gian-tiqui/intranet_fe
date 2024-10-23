import React from "react";
import MotionTemplate from "./animation/MotionTemplate";
import GlobalSearch from "./GlobalSearch";

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
          {Array(7)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="w-36 h-10 bg-white dark:bg-neutral-900 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-neutral-700"
              ></div>
            ))}
        </div>
      </div>
    </MotionTemplate>
  );
};

export default Welcome;
