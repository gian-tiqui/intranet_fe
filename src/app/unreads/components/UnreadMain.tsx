"use client";
import { fetchUserUnreads } from "@/app/functions/functions";
import PostContainer from "@/app/posts/components/PostContainer";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const UnreadMain = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["unread"],
    queryFn: fetchUserUnreads,
  });

  if (isError) {
    console.error(error);
  }

  return (
    <div>
      {isLoading && <PostSkeleton />}
      {data &&
        data.map((d, index) => (
          <PostContainer generalPost id={d.pid} key={index} type="unread" />
        ))}
    </div>
  );
};

export default UnreadMain;
