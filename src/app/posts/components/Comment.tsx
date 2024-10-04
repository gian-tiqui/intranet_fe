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
        {/* Avatar Section */}
        <div className="h-10 w-10 bg-white rounded-full flex-shrink-0"></div>

        {/* Comment Content Section */}
        <div className="mt-1 w-full min-w-0">
          <p className="font-bold">
            {comment.user.firstName} {comment.user.lastName}
          </p>
          <div className="w-full">
            <p className="break-words overflow-wrap break-word">
              {comment.message}
            </p>
          </div>

          {/* Replies Section */}
          {isReply && (
            <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-700 p-1 cursor-pointer rounded w-16 mb-5 mt-1">
              <div onClick={() => setShowReplies(!showReplies)}>
                <p className="text-sm">Replies</p>
              </div>
            </HoverBox>
          )}

          {/* Show Replies Animation */}
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
