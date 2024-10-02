"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";

const Comments = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <CommentSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 pb-24">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <Comment isReply key={index} />
        ))}
    </div>
  );
};

export default Comments;
