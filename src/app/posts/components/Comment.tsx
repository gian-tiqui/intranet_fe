"use client";
import React, { useEffect, useState } from "react";
import HoverBox from "@/app/components/HoverBox";
import CommentBar from "./CommentBar";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import { AnimatePresence } from "framer-motion";
import { PostComment } from "@/app/types/types";
import { decodeUserData } from "@/app/functions/functions";
import useReply from "@/app/custom-hooks/reply";
import showDeleteCommentModalStore from "@/app/store/deleteComment";
import commentIdStore from "@/app/store/commentId";
import { useForm } from "react-hook-form";
import useSetCommentsStore from "@/app/store/useCommentsStore";
import apiClient from "@/app/http-common/apiUrl";
import { API_BASE, INTRANET } from "@/app/bindings/binding";

interface Props {
  isReply?: boolean;
  comment: PostComment;
  postId: number;
}

interface FormFields {
  message: string;
}

const Comment: React.FC<Props> = ({ isReply, comment, postId }) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [mReplies, setMReplies] = useState<PostComment[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { setShowDeleteComment } = showDeleteCommentModalStore();
  const { setCommentId } = commentIdStore();
  const { handleSubmit, register, setValue } = useForm<FormFields>();
  const { setComments, comments } = useSetCommentsStore();

  const reply = useReply(comment.cid);

  const handleDeleteClicked = () => {
    setShowDeleteComment(true);
    setCommentId(comment.cid);
  };

  useEffect(() => {
    if (comment.message) setValue("message", comment.message);
  }, [comment, setValue]);

  const handleEditSaved = async (data: FormFields) => {
    if (comment.message === data.message) {
      setEditMode(false);
      return;
    }
    try {
      const response = await apiClient.put(
        `${API_BASE}/comment/${comment.cid}`,
        {
          message: data.message,
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      if (response.data.statusCode === 204) {
        const newComment = response.data.comment;

        const updatedComments = [
          ...comments.filter((mComment) => comment.cid !== mComment.cid),
          newComment,
        ];

        setComments(updatedComments);
      }

      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

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
          <form
            onSubmit={handleSubmit(handleEditSaved)}
            className={`w-full flex pe-5 py-1 ${
              editMode
                ? "bg-white dark:bg-neutral-700 rounded shadow"
                : "bg-inherit"
            }`}
          >
            <input
              {...register("message", { required: true })}
              className={`break-words overflow-wrap break-word outline-none px-2 bg-inherit w-full`}
              disabled={!editMode}
            />

            {editMode && <button type="submit">Save</button>}
          </form>

          {/* Replies Section */}
          <div className="flex gap-1">
            {isReply && (
              <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-3 cursor-pointer rounded mb-5 mt-1 text-center">
                <div onClick={() => setShowReplies(!showReplies)}>
                  <p className="text-sm">Replies</p>
                </div>
              </HoverBox>
            )}
            {comment.userId === decodeUserData()?.sub && (
              <>
                {!editMode && (
                  <>
                    <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-3 cursor-pointer rounded mb-5 mt-1 text-center">
                      <div onClick={() => setEditMode(true)}>
                        <p className="text-sm">Edit</p>
                      </div>
                    </HoverBox>
                    <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-3 cursor-pointer rounded mb-5 mt-1 text-center">
                      <div onClick={handleDeleteClicked}>
                        <p className="text-sm">Delete</p>
                      </div>
                    </HoverBox>
                  </>
                )}
              </>
            )}
          </div>

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
