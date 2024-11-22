"use client";

import NoPosts from "@/app/bulletin/components/NoPosts";
import HoverBox from "@/app/components/HoverBox";
import Shortcuts from "@/app/bulletin/components/Shortcuts";
import { fetchPostsByLevel } from "@/app/functions/functions";
import PostContainer from "@/app/posts/components/PostContainer";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const ForYou = () => {
  const [maxNum, setMaxNum] = useState<number>(3);
  const [direction, setDirection] = useState<string>("desc");
  const [minMax, setMinMax] = useState<{ min: number; max: number }>({
    min: 0,
    max: 2,
  });
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["level_posts", direction, minMax],
    queryFn: fetchPostsByLevel,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const isLastPage = minMax.max >= totalPosts;

  useEffect(() => {
    if (data) {
      setTotalPosts(data.count);
    }
  }, [data]);

  if (isError) console.error(error);

  return (
    <div>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {data?.posts && data.posts.length > 0 ? (
            <>
              <Shortcuts
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {data.posts.slice(0, maxNum).map((post) => (
                <PostContainer id={post.pid} key={post.pid} generalPost />
              ))}

              {data.posts.length > maxNum && (
                <HoverBox className="py-1 px-2 cursor-pointer rounded grid place-content-center">
                  <button
                    onClick={() => setMaxNum((prevMax) => prevMax + 3)}
                    className="w-36 h-10 rounded-md my-5 hover:bg-gray-300 dark:hover:bg-neutral-800"
                  >
                    Show more
                  </button>
                </HoverBox>
              )}

              <Shortcuts
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />
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
