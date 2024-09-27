import React from "react";
import Comment from "./Comment";

const Comments = () => {
  return (
    <div className="flex flex-col gap-6 pb-24">
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </div>
  );
};

export default Comments;
