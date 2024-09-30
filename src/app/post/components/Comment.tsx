import React from "react";
import Replies from "./Replies";
import HoverBox from "@/app/components/HoverBox";

const Comment = () => {
  return (
    <div>
      <div className="flex gap-6">
        <div className="h-10 w-10 bg-white rounded-full"></div>
        <div className="max-w-[85%] mt-1">
          <p className="font-bold">Westlake User</p>
          <div className="mb-1">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <HoverBox className="hover:bg-neutral-30 0 dark:hover:bg-neutral-700 p-2 cursor-pointer rounded w-20">
            <Replies />
          </HoverBox>
        </div>
      </div>
    </div>
  );
};

export default Comment;
