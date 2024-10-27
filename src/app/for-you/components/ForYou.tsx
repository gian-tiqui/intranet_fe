"use client";
import HoverBox from "@/app/components/HoverBox";
import { fetchPostsByLevel } from "@/app/functions/functions";
import NoPosts from "@/app/posts/components/NoPosts";
import PostContainer from "@/app/posts/components/PostContainer";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const ForYou = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["level_posts"],
    queryFn: fetchPostsByLevel,
  });
  const [maxNum, setMaxNum] = useState<number>(3);

  if (isError) console.error(error);

  return (
    <div>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {data && data.length > 0 ? (
            <>
              {data.slice(0, maxNum).map((post) => (
                <PostContainer id={post.pid} key={post.pid} generalPost />
              ))}
              {data.length > 3 && (
                <HoverBox className=" py-1 px-2 cursor-pointer rounded grid place-content-center">
                  <button
                    onClick={() => setMaxNum((prevMax) => prevMax + 3)}
                    className="w-36 h-10 rounded-md my-5 hover:bg-gray-300 dark:hover:bg-neutral-800"
                  >
                    Show more
                  </button>
                </HoverBox>
              )}
            </>
          ) : (
            <NoPosts />
          )}
        </>
      )}
    </div>
  );
};

export default ForYou;
