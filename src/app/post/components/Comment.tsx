import React from "react";
import Replies from "./Replies";
import HoverBox from "@/app/components/HoverBox";

const Comment = () => {
  return (
    <div>
      <div className="flex gap-6">
        <div className="h-10 w-10 bg-white rounded-full"></div>
        <div className="max-w-[85%] mt-1">
          <p className="font-bold">Commentor name</p>
          <div className="mb-1">
            <p>
              hi this is my comment hi this is my commenthi this is my
              commenthithis is my commenthi this is my commentthis is my
              commenthi this is my comment
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
