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
import { API_BASE } from "@/app/bindings/binding";
import { Icon } from "@iconify/react/dist/iconify.js";
import useCommentIdRedirector from "@/app/store/commentRedirectionId";

interface Props {
  isReply?: boolean;
  comment: PostComment;
  postId: number;
  isPreview?: boolean;
}

interface FormFields {
  message: string;
}

const Comment: React.FC<Props> = ({ isReply, comment, postId, isPreview }) => {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [mReplies, setMReplies] = useState<PostComment[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { setShowDeleteComment } = showDeleteCommentModalStore();
  const { setCommentId } = commentIdStore();
  const { handleSubmit, register, setValue } = useForm<FormFields>();
  const { setComments, comments } = useSetCommentsStore();
  const [saving, setSaving] = useState<boolean>(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
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
        // Add highlight effect
        commentElement.classList.add("highlight-comment");
        setTimeout(() => {
          commentElement.classList.remove("highlight-comment");
        }, 3000);
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

  if (isPreview)
    return (
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40">
        <div className="h-8 w-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full shadow-lg flex-shrink-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {comment.user ? comment.user.firstName[0] : "?"}
          </span>
        </div>
        <div className="min-w-0 flex-grow">
          {comment.userId === decodeUserData()?.sub ? (
            <p className="font-bold text-gray-900 dark:text-white">You</p>
          ) : (
            <p className="font-bold text-gray-900 dark:text-white">
              {comment.user
                ? comment.user.firstName + " " + comment.user.lastName
                : "You (New)"}
            </p>
          )}
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
            replied: {comment.message}
          </p>
        </div>
      </div>
    );

  return (
    <div id={`comment-${comment.cid}`} className="group">
      <div className="flex gap-4 p-4 rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-indigo-50/40 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20">
        {/* Avatar Section */}
        <div className="flex-shrink-0 relative">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <span className="relative z-10 text-white font-black text-lg drop-shadow-lg">
              {comment.user
                ? comment.user.firstName[0] + comment.user.lastName[0]
                : "??"}
            </span>
          </div>
          {/* Online indicator */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg"></div>
        </div>

        {/* Comment Content Section */}
        <div className="flex-grow min-w-0">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            {comment.userId === decodeUserData()?.sub ? (
              <p className="font-black text-lg text-blue-600 dark:text-blue-400">
                You
              </p>
            ) : (
              <p className="font-black text-lg text-gray-900 dark:text-white">
                {comment.user
                  ? comment.user.firstName + " " + comment.user.lastName
                  : "Anonymous User"}
              </p>
            )}
            <div className="w-2 h-2 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {new Date(comment.createdAt || Date.now()).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>

          {/* Comment Message */}
          <div ref={inputRef} className="mb-4">
            <form
              onSubmit={handleSubmit(handleEditSaved)}
              className={`w-full flex items-end gap-3 ${
                editMode
                  ? "bg-gradient-to-r from-white/90 to-blue-50/90 dark:from-neutral-700/90 dark:to-blue-950/50 rounded-2xl shadow-lg p-4 backdrop-blur-sm border border-blue-200/60 dark:border-blue-800/40"
                  : "bg-inherit"
              }`}
            >
              <textarea
                {...register("message", { required: true })}
                className={`break-words overflow-wrap break-word outline-none px-3 py-2 bg-inherit w-full rounded-xl resize-none transition-all duration-300 ${
                  editMode
                    ? "min-h-[100px] font-medium text-gray-800 dark:text-gray-200"
                    : "font-medium text-gray-700 dark:text-gray-300 text-base leading-relaxed"
                }`}
                disabled={!editMode}
                rows={editMode ? 3 : undefined}
              />

              {editMode && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {saving ? (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg">
                      <Icon
                        icon={"line-md:loading-loop"}
                        className="h-6 w-6 text-white"
                      />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                    >
                      <Icon
                        icon={"material-symbols:save-outline"}
                        className="h-5 w-5"
                      />
                      Save
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            {isReply && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="group flex items-center gap-2 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/50 dark:to-indigo-900/50 hover:from-blue-200/90 hover:to-indigo-200/90 dark:hover:from-blue-800/60 dark:hover:to-indigo-800/60 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    icon={"mdi:message-reply-outline"}
                    className="h-4 w-4 text-white"
                  />
                </div>
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  Reply
                </span>
                {mReplies.length > 0 && (
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
                    {mReplies.length}
                  </div>
                )}
              </button>
            )}

            {comment.userId === decodeUserData()?.sub && (
              <div className="flex items-center gap-2">
                {!editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="group flex items-center gap-2 bg-gradient-to-r from-gray-100/80 to-slate-100/80 dark:from-neutral-700/50 dark:to-neutral-600/50 hover:from-gray-200/90 hover:to-slate-200/90 dark:hover:from-neutral-600/60 dark:hover:to-neutral-500/60 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-200/40 dark:border-neutral-600/40"
                    >
                      <div className="bg-gradient-to-br from-gray-500 to-slate-600 p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon
                          icon={"lucide:edit"}
                          className="h-4 w-4 text-white"
                        />
                      </div>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        Edit
                      </span>
                    </button>

                    <button
                      onClick={handleDeleteClicked}
                      className="group flex items-center gap-2 bg-gradient-to-r from-red-100/80 to-rose-100/80 dark:from-red-900/30 dark:to-rose-900/30 hover:from-red-200/90 hover:to-rose-200/90 dark:hover:from-red-800/40 dark:hover:to-rose-800/40 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-red-200/40 dark:border-red-800/40"
                    >
                      <div className="bg-gradient-to-br from-red-500 to-rose-600 p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                        <Icon
                          icon={"material-symbols:delete-outline"}
                          className="h-4 w-4 text-white"
                        />
                      </div>
                      <span className="font-bold text-red-700 dark:text-red-300">
                        Delete
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(false)}
                    className="group flex items-center gap-2 bg-gradient-to-r from-gray-100/80 to-slate-100/80 dark:from-neutral-700/50 dark:to-neutral-600/50 hover:from-gray-200/90 hover:to-slate-200/90 dark:hover:from-neutral-600/60 dark:hover:to-neutral-500/60 px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-gray-200/40 dark:border-neutral-600/40"
                  >
                    <div className="bg-gradient-to-br from-gray-500 to-slate-600 p-1.5 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Icon
                        icon={"material-symbols:cancel-outline"}
                        className="h-4 w-4 text-white"
                      />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Cancel
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Replies Section */}
          <AnimatePresence>
            {showReplies && (
              <MotionTemplate>
                <div className="ml-4 border-l-4 border-gradient-to-b from-blue-300 to-indigo-400 dark:from-blue-700 dark:to-indigo-800 pl-6 space-y-4 mb-6 relative">
                  {/* Decorative gradient line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-600 rounded-full shadow-lg"></div>

                  {mReplies?.map((reply) => (
                    <div
                      key={reply.cid}
                      className="bg-gradient-to-r from-blue-50/40 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-4 backdrop-blur-sm border border-blue-200/30 dark:border-blue-800/30"
                    >
                      <Comment comment={reply} postId={postId} />
                    </div>
                  ))}

                  <div className="bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-neutral-800/60 dark:to-blue-950/40 rounded-2xl p-4 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 shadow-lg">
                    <CommentBar
                      parentId={comment.cid}
                      comments={mReplies}
                      setComments={setMReplies}
                    />
                  </div>
                </div>
              </MotionTemplate>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CSS for highlight effect */}
      <style jsx>{`
        @keyframes highlightPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            background: rgba(59, 130, 246, 0.1);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
            background: rgba(59, 130, 246, 0.05);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            background: transparent;
          }
        }

        :global(.highlight-comment) {
          animation: highlightPulse 1.5s ease-out;
          border-radius: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Comment;
