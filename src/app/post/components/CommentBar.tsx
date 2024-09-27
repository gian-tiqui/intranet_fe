import React from "react";
import { Icon } from "@iconify/react";

const CommentBar = () => {
  return (
    <div className="fixed bottom-5 md:w-[60%] lg:w-[44.7%] h-14 rounded-full bg-white cursor-text flex items-center gap-3 px-2 shadow">
      <div className="bg-neutral-200 rounded-full grid place-content-center h-10 w-14">
        <Icon icon={"eva:attach-fill"} className="h-5 w-5 cursor-pointer" />
      </div>
      <input placeholder="Comment here" className="w-full outline-none px-2" />
      <div className="bg-neutral-200 rounded-full grid place-content-center h-10 w-14">
        <Icon icon={"mi:send"} className="h-5 w-5 cursor-pointer" />
      </div>
    </div>
  );
};

export default CommentBar;
