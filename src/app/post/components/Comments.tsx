import React from "react";
import Comment from "./Comment";

const Comments = () => {
  return (
    <div className="flex flex-col gap-6 pb-24">
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <Comment isReply key={index} />
        ))}
    </div>
  );
};

export default Comments;
