"use client";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { CreateComment } from "@/app/types/types";

interface Props {
  postId?: number;
  parentId?: number;
}

interface FormFields {
  message: string;
}

const CommentBar: React.FC<Props> = ({ postId, parentId }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { register, handleSubmit } = useForm<FormFields>();

  const handleInput = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleCommentSubmit = (data: FormFields) => {
    const createComment: CreateComment = {
      userId: 7,
      message: data.message,
      postId,
      parentId,
    };

    console.log(createComment);
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
