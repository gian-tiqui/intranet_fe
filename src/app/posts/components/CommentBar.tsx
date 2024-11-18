"use client";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { CreateComment, PostComment } from "@/app/types/types";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { decodeUserData } from "@/app/functions/functions";
import { useRouter } from "next/navigation";

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
  const { register, handleSubmit, reset } = useForm<FormFields>();
  const router = useRouter();
  const [spamming, setSpamming] = useState<boolean>(false);

  const handleInput = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        if (response.status === 201) {
          reset();

          router.refresh();

          handleCommentAdded(response.data);

          if (response.data.postId == null) {
            await apiClient.post(
              `${API_BASE}/notification/comment-reply`,
              null,
              {
                params: {
                  userId: response.data.userId,
                  commentId: response.data.cid,
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
                },
              }
            );
          } else {
            await apiClient.post(`${API_BASE}/notification/post-reply`, null, {
              params: {
                userId: response.data.userId,
                postId: response.data.postId,
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
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
    <form
      onSubmit={handleSubmit(handleCommentSubmit)}
      className="sticky bottom-0 pb-8 bg-neutral-200 dark:bg-neutral-800"
    >
      <div className="w-full h-auto rounded-3xl rounded-b-3xl bg-white dark:bg-neutral-700 ps-6 cursor-text flex items-end gap-3 px-3 py-[10px]">
        <textarea
          {...register("message", { required: true })}
          placeholder="Comment here"
          className="w-full outline-none px-2 resize-none overflow-hidden min-h-8 max-h-[200px] dark:bg-neutral-700"
          rows={1}
          onInput={handleInput}
        />
        {spamming ? (
          <Icon icon={"line-md:loading-loop"} className="h-8 w-8" />
        ) : (
          <button
            type="submit"
            className="bg-neutral-200 rounded-2xl grid place-content-center h-9 w-10 dark:bg-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-800"
          >
            <Icon icon={"mi:send"} className="h-5 w-5 cursor-pointer" />
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentBar;
