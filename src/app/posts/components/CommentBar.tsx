"use client";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { CreateComment, PostComment } from "@/app/types/types";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";

interface Props {
  postId?: number;
  parentId?: number;
  comments?: PostComment[];
  setComments?: Dispatch<SetStateAction<PostComment[]>>;
}

interface FormFields {
  message: string;
}

const CommentBar: React.FC<Props> = ({ postId, parentId }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { register, handleSubmit, reset } = useForm<FormFields>();

  const handleInput = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleCommentSubmit = async (data: FormFields) => {
    const createComment: CreateComment = {
      userId: 7,
      message: data.message,
      postId,
      parentId,
    };

    try {
      const response = await apiClient.post(`${API_BASE}/comment`, {
        ...createComment,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      if (response.status === 201) {
        reset();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleCommentSubmit)}
      className="sticky bottom-0 pb-8 bg-neutral-200 dark:bg-neutral-800"
    >
      <div className="w-full h-auto rounded-3xl rounded-b-3xl bg-white dark:bg-neutral-700 cursor-text flex items-end gap-3 px-3 py-[10px] shadow-2xl">
        <div className="bg-neutral-200 rounded-2xl grid place-content-center h-9 w-10 dark:bg-neutral-500">
          <Icon icon={"eva:attach-fill"} className="h-5 w-5 cursor-pointer" />
        </div>
        <textarea
          {...register("message", { required: true })}
          placeholder="Comment here"
          className="w-full outline-none px-2 resize-none overflow-hidden min-h-8 max-h-[200px] dark:bg-neutral-700"
          rows={1}
          onInput={handleInput}
        />
        <button
          type="submit"
          className="bg-neutral-200 rounded-2xl grid place-content-center h-9 w-10 dark:bg-neutral-500"
        >
          <Icon icon={"mi:send"} className="h-5 w-5 cursor-pointer" />
        </button>
      </div>
    </form>
  );
};

export default CommentBar;
