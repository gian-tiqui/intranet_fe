"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { Icon } from "@iconify/react/dist/iconify.js";
import useCommentIdRedirector from "@/app/store/commentRedirectionId";

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
  const [saving, setSaving] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { cid } = useCommentIdRedirector();

  const reply = useReply(comment.cid);

  const handleDeleteClicked = () => {
    setShowDeleteComment(true);
    setCommentId(comment.cid);
  };

  useEffect(() => {
    const commentId = `comment-${cid}`;

    if (+commentId.split("-")[1] === comment.cid) {
      const commentElement = document.getElementById(commentId);

      if (commentElement) {
        commentElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.log("element not found");
      }
    }
  }, [comment, cid]);

  useEffect(() => {
    const handleEditMode = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        if (editMode === true) {
          setEditMode(false);
        }
      }
    };

    document.addEventListener("click", handleEditMode);

    return () => document.removeEventListener("click", handleEditMode);
  }, [editMode]);

  useEffect(() => {
    if (comment.message) setValue("message", comment.message);
  }, [comment, setValue]);

  const handleEditSaved = async (data: FormFields) => {
    if (comment.message === data.message) {
      setEditMode(false);
      return;
    }
    try {
      setSaving(true);
      const response = await apiClient.put(
        `${API_BASE}/comment/${comment.cid}`,
        {
          message: data.message,
          updatedBy: decodeUserData()?.sub,
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      if (response.data.statusCode === 204) {
        const updatedComments = [
          ...comments.filter((mComment) => comment.cid !== mComment.cid),
        ];

        if (isReply) {
          const newComment = response.data.comment;

          updatedComments.unshift(newComment);
        }

        setComments(updatedComments);
      }

      setEditMode(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setMReplies(reply);
  }, [reply, isReply]);

  return (
    <div id={`comment-${comment.cid}`}>
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
          <div ref={inputRef}>
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

              {editMode &&
                (saving ? (
                  <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
                ) : (
                  <div className="flex items-center gap-1">
                    <Icon icon={"material-symbols:save-outline"} />

                    <button type="submit" className="text-sm">
                      Save
                    </button>
                  </div>
                ))}
            </form>
          </div>

          {/* Replies Section */}
          <div className="flex gap-1">
            {isReply && (
              <div
                onClick={() => setShowReplies(!showReplies)}
                className="hover:bg-neutral-300 flex gap-1 items-center dark:hover:bg-neutral-700 py-1 px-3 cursor-pointer rounded mb-5 mt-1 text-center"
              >
                <Icon icon={"mdi:message-reply-outline"} />

                <p className="text-sm">Replies</p>
              </div>
            )}
            {comment.userId === decodeUserData()?.sub && (
              <>
                {!editMode ? (
                  <>
                    <div
                      onClick={() => setEditMode(true)}
                      className="hover:bg-neutral-300 dark:hover:bg-neutral-700 py-1 px-3 flex items-center gap-2 cursor-pointer rounded mb-5 mt-1 text-center"
                    >
                      <Icon icon={"lucide:edit"} />

                      <p className="text-sm">Edit</p>
                    </div>
                    <div
                      onClick={handleDeleteClicked}
                      className="hover:bg-neutral-300 flex items-center gap-1 dark:hover:bg-neutral-700 py-1 px-3 cursor-pointer rounded mb-5 mt-1 text-center"
                    >
                      <Icon icon={"material-symbols:delete-outline"} />
                      <p className="text-sm">Delete</p>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => setEditMode(false)}
                    className="hover:bg-neutral-300 dark:hover:bg-neutral-700 flex items-center gap-1 py-1 px-3 cursor-pointer rounded mb-5 mt-1 text-center"
                  >
                    <Icon icon={"material-symbols:cancel-outline"} />
                    <p className="text-sm">Cancel</p>
                  </div>
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
