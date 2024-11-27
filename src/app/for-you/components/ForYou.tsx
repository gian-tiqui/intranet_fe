"use client";

import NoPosts from "@/app/bulletin/components/NoPosts";
import Shortcuts from "@/app/bulletin/components/Shortcuts";
import { fetchPostsByLevel } from "@/app/functions/functions";
import PostContainer from "@/app/posts/components/PostContainer";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const ForYou = () => {
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
                min={minMax.min}
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {data.posts.map((post) => (
                <PostContainer
                  id={post.pid}
                  key={post.pid}
                  generalPost
                  type="for-you"
                />
              ))}

              <Shortcuts
                min={minMax.min}
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
