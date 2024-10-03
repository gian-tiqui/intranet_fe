"use client";
import React, { useState } from "react";
import HoverBox from "@/app/components/HoverBox";
import CommentBar from "./CommentBar";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import { AnimatePresence } from "framer-motion";
import { PostComment } from "@/app/types/types";

interface Props {
  isReply?: boolean;
  comment: PostComment;
  postId: number;
}

const Comment: React.FC<Props> = ({ isReply, comment, postId }) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);

  return (
    <div>
      <div className="flex gap-6">
        <div className="h-10 w-10 bg-white rounded-full"></div>
        <div className="mt-1 w-full">
          <p className="font-bold">
            {comment.user.firstName} {comment.user.lastName}
          </p>
          <div className="">
            <p className="">{comment.message}</p>
          </div>
          {isReply && (
            <HoverBox className="hover:bg-neutral-30 0 dark:hover:bg-neutral-700 p-2 cursor-pointer rounded w-20 mb-5">
              <div onClick={() => setShowReplies(!showReplies)}>Replies</div>
            </HoverBox>
          )}
          <AnimatePresence>
            {showReplies && (
              <MotionTemplate>
                <div className="flex flex-col gap-2 mb-5">
                  {comment.replies?.map((reply) => (
                    <Comment key={reply.cid} comment={reply} postId={postId} />
                  ))}
                </div>
                <CommentBar parentId={comment.cid} />
              </MotionTemplate>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Comment;
