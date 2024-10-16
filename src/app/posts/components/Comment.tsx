"use client";
import React, { useEffect, useState } from "react";
import HoverBox from "@/app/components/HoverBox";
import CommentBar from "./CommentBar";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import { AnimatePresence } from "framer-motion";
import { PostComment } from "@/app/types/types";
import { decodeUserData } from "@/app/functions/functions";
import useReply from "@/app/custom-hooks/reply";

interface Props {
  isReply?: boolean;
  comment: PostComment;
  postId: number;
}

const Comment: React.FC<Props> = ({ isReply, comment, postId }) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [mReplies, setMReplies] = useState<PostComment[]>([]);

  const reply = useReply(comment.cid);

  useEffect(() => {
    setMReplies(reply);
  }, [reply, isReply]);

  return (
    <div>
      <div className="flex gap-6">
        {/* Avatar Section */}
        <div className="h-10 w-10 bg-white rounded-full flex-shrink-0"></div>

        {/* Comment Content Section */}
        <div className="mt-1 w-full min-w-0">
          {comment.userId === decodeUserData()?.sub ? (
            <p className="font-bold">You</p>
          ) : (
            <p className="font-bold">
              {comment.user
                ? comment.user.firstName + " " + comment.user.lastName
                : "You (New)"}
            </p>
          )}
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
                  {mReplies?.map((reply) => (
                    <Comment key={reply.cid} comment={reply} postId={postId} />
                  ))}
                </div>
                <CommentBar
                  parentId={comment.cid}
                  comments={mReplies}
                  setComments={setMReplies}
                />
              </MotionTemplate>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Comment;
