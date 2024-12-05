"use client";
import { getPostsFromSubfolderById } from "@/app/functions/functions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

interface State {
  id: number;
}

const FolderContent: React.FC<State> = ({ id }) => {
  const {
    data: posts,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`folder-post-${id}`],
    queryFn: () => getPostsFromSubfolderById(id),
  });

  if (isError) console.error(error);

  if (isLoading) return <p>Loading files from data</p>;

  return (
    <div>
      {posts &&
        posts.length > 0 &&
        posts.map((post) => <p key={post.pid}>{post.title}</p>)}
    </div>
  );
};

export default FolderContent;
