"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import PostContainer from "../posts/components/PostContainer";
import usePosts from "../custom-hooks/posts";

const DepartmentsBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  const posts = usePosts();

  return (
    <div>
      {posts.slice(0, maxNum).map((post) => (
        <PostContainer id={post.pid} key={post.pid} generalPost />
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

export default DepartmentsBulletin;
