"use client";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";

const CommentBar = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="sticky bottom-0 pb-8 bg-neutral-200">
      <div className="w-full h-auto rounded-3xl bg-white cursor-text flex items-end gap-3 px-2 py-[10px] shadow">
        <div className="bg-neutral-200 rounded-full grid place-content-center h-8 w-10">
          <Icon icon={"eva:attach-fill"} className="h-5 w-5 cursor-pointer" />
        </div>
        <textarea
          ref={textareaRef}
          placeholder="Comment here"
          className="w-full outline-none px-2 resize-none overflow-hidden min-h-7 max-h-[200px]"
          rows={1}
          onInput={handleInput}
        />
        <div className="bg-neutral-200 rounded-full grid place-content-center h-8 w-10">
          <Icon icon={"mi:send"} className="h-5 w-5 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default CommentBar;
