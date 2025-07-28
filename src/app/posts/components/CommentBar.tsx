"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { CreateComment, PostComment } from "@/app/types/types";
import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { decodeUserData } from "@/app/functions/functions";
import { useRouter } from "next/navigation";
import useSignalStore from "@/app/store/signalStore";
import { Button } from "primereact/button";

interface Props {
  postId?: number;
  parentId?: number;
  comments?: PostComment[];
  setComments?: Dispatch<SetStateAction<PostComment[]>>;
}

interface FormFields {
  message: string;
}

const CommentBar: React.FC<Props> = ({
  postId,
  parentId,
  comments,
  setComments,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { register, handleSubmit, reset, watch } = useForm<FormFields>();
  const router = useRouter();
  const [spamming, setSpamming] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { setSignal } = useSignalStore();

  const messageValue = watch("message");
  const hasContent = messageValue && messageValue.trim().length > 0;

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleCommentAdded = (comment: PostComment) => {
    if (comments && setComments) {
      const mComments = [comment, ...comments?.map((comment) => comment)];
      setComments(mComments as PostComment[]);
    }
  };

  const handleCommentSubmit = async (data: FormFields) => {
    const userId = decodeUserData()?.sub;
    if (userId) {
      const createComment: CreateComment = {
        userId: userId,
        message: data.message,
        postId,
        parentId,
      };

      try {
        setSpamming(true);
        const response = await apiClient.post(`${API_BASE}/comment`, {
          ...createComment,
        });

        if (response.status === 201) {
          reset();
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }

          router.refresh();
          handleCommentAdded(response.data);
          setSignal(true);

          if (!response.data.postId) {
            await apiClient.post(
              `${API_BASE}/notification/comment-reply`,
              null,
              {
                params: {
                  userId: response.data.userId,
                  commentId: response.data.cid,
                },
              }
            );
          } else {
            await apiClient.post(`${API_BASE}/notification/post-reply`, null, {
              params: {
                userId: response.data.userId,
                postId: response.data.postId,
                cid: response.data.cid,
              },
            });
          }
        }
      } catch (error) {
        console.error(error);
        setSpamming(true);
        setTimeout(() => setSpamming(false), 5000);
      } finally {
        setSpamming(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>

      <form
        onSubmit={handleSubmit(handleCommentSubmit)}
        className="sticky bottom-0 pb-8 pt-4 backdrop-blur-xl max-w-[90%] w-full mx-auto"
      >
        <div
          className={`relative w-full rounded-3xl transition-all duration-500 ${
            isFocused || hasContent
              ? "bg-gradient-to-r from-white/95 via-blue-50/95 to-indigo-50/95 dark:from-neutral-800/95 dark:via-blue-950/60 dark:to-indigo-950/60 shadow-2xl border-2 border-blue-300/60 dark:border-blue-700/60 scale-[1.02]"
              : "bg-gradient-to-r from-white/80 to-gray-100/80 dark:from-neutral-800/80 dark:to-neutral-700/80 shadow-xl border border-gray-200/60 dark:border-neutral-600/60"
          } backdrop-blur-xl overflow-hidden`}
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full transition-all duration-1000 ${
                isFocused ? "animate-pulse scale-150" : ""
              }`}
            ></div>
            <div
              className={`absolute -bottom-10 -left-10 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full transition-all duration-1000 ${
                isFocused ? "animate-pulse scale-150" : ""
              }`}
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          <div className="relative flex items-end gap-4 p-6">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <span className="relative z-10 text-white font-black text-lg drop-shadow-lg">
                  {decodeUserData()?.firstName?.[0] || "U"}
                </span>
              </div>
            </div>

            {/* Input Section */}
            <div className="flex-grow relative">
              {/* Placeholder overlay */}
              {!hasContent && !isFocused && (
                <div className="absolute left-4 top-4 pointer-events-none z-10 flex items-center gap-2 text-gray-400 dark:text-gray-500">
                  <Icon
                    icon="material-symbols:edit-rounded"
                    className="h-5 w-5"
                  />
                  <span className="font-medium">Share your thoughts...</span>
                </div>
              )}

              <textarea
                {...register("message", { required: true })}
                placeholder=""
                className={`w-full outline-none px-4 py-4 resize-none overflow-hidden min-h-[3rem] max-h-[12rem] bg-transparent transition-all duration-300 font-medium text-gray-800 dark:text-gray-200 ${
                  isFocused || hasContent ? "text-base" : "text-transparent"
                }`}
                rows={1}
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />

              {/* Character counter */}
              {hasContent && (
                <div className="absolute bottom-2 left-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
                  {messageValue.length} characters
                </div>
              )}
            </div>

            {/* Send Button */}
            <div className="flex-shrink-0">
              {spamming ? (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-xl">
                  <Icon
                    icon={"line-md:loading-loop"}
                    className="h-6 w-6 text-white"
                  />
                </div>
              ) : (
                <Button
                  type="submit"
                  disabled={!hasContent}
                  className={`relative group rounded-2xl p-4 shadow-xl transition-all duration-300 overflow-hidden ${
                    hasContent
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 scale-100 hover:scale-110 shadow-2xl"
                      : "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-neutral-600 dark:to-neutral-500 scale-90 opacity-50"
                  }`}
                >
                  {/* Button glow effect */}
                  {hasContent && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <Icon
                      icon={
                        hasContent ? "mi:send" : "material-symbols:send-rounded"
                      }
                      className={`h-6 w-6 text-white transition-transform duration-300 ${
                        hasContent ? "group-hover:translate-x-1" : ""
                      }`}
                    />
                    {hasContent && (
                      <span className="font-bold text-white text-sm">Send</span>
                    )}
                  </div>
                </Button>
              )}
            </div>
          </div>

          {/* Typing indicator line */}
          {isFocused && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-b-3xl">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-b-3xl animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Quick Actions (shown when focused) */}
        {isFocused && (
          <div className="mt-4 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Icon
                  icon="material-symbols:tips-and-updates-rounded"
                  className="h-4 w-4"
                />
                <span className="text-xs font-medium">
                  {parentId ? "Replying to comment" : "Commenting on post"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-neutral-700 dark:to-neutral-600 px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  Ctrl + Enter to send
                </span>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* CSS for enhanced animations */}
      <style jsx>{`
        @keyframes gentleGlow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
          }
        }

        .glow-effect {
          animation: gentleGlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CommentBar;
