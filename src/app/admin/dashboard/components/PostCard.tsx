import { Post } from "@/app/types/types";
import React from "react";

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <div className="rounded bg-neutral-600 w-full p-4 shadow">
      <div className="flex justify-between w-full">{post.title}</div>
    </div>
  );
};

export default PostCard;
