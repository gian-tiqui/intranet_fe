"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";
import { PostComment } from "@/app/types/types";

interface Props {
  comments: PostComment[];
  postId: number;
}

const Comments: React.FC<Props> = ({ comments, postId }) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, [comments]);

  if (loading) {
    return <CommentSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 pb-24 ">
      {comments.map((comment) => (
        <Comment isReply key={comment.cid} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default Comments;
