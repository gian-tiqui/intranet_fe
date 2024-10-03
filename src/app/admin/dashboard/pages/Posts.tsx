"use client";
import usePosts from "@/app/custom-hooks/posts";
import React from "react";
import PostCard from "../components/PostCard";

const Posts = () => {
  const posts = usePosts();
  return (
    <div className="grid grid-cols-3 gap-3">
      {posts.map((post) => (
        <PostCard post={post} key={post.pid} />
      ))}
    </div>
  );
};

export default Posts;
