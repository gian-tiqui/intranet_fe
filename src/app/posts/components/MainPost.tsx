"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useState } from "react";
import PostContainer from "./PostContainer";

const MainPost = () => {
  const [maxNum, setMaxNum] = useState<number>(3);

  return (
    <div>
      {Array(10)
        .fill(0)
        .slice(0, maxNum)
        .map((_, index) => (
          <PostContainer id={index} key={index} generalPost />
        ))}
      <HoverBox className=" py-1 px-2 cursor-pointer rounded grid place-content-center">
        <button
          onClick={() => setMaxNum((prevMax) => prevMax + 3)}
          className="w-36 h-10 rounded-md my-5 hover:bg-gray-300 dark:hover:bg-neutral-800"
        >
          Show more
        </button>
      </HoverBox>
    </div>
  );
};

export default MainPost;
