"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";
import { MinMax, PostComment } from "@/app/types/types";
import useCommentIdRedirector from "@/app/store/commentRedirectionId";

interface Props {
  comments: PostComment[];
  postId: number;
}

const Comments: React.FC<Props> = ({ comments, postId }) => {
  const { cid } = useCommentIdRedirector();
  const [loading, setLoading] = useState<boolean>(true);
  const [minMax, setMinMax] = useState<MinMax>({
    min: 0,
    max: cid ? comments.length : 5,
  });

  useEffect(() => {
    setLoading(false);
  }, [comments]);

  if (loading) {
    return <CommentSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 pb-24 mx-auto w-[80%]">
      {comments.slice(minMax.min, minMax.max).map((comment) => (
        <Comment isReply key={comment.cid} comment={comment} postId={postId} />
      ))}
      {comments.length > 3 && (
        <button
          onClick={() => setMinMax({ min: minMax.min, max: minMax.max + 5 })}
        >
          Show more
        </button>
      )}
    </div>
  );
};

export default Comments;
