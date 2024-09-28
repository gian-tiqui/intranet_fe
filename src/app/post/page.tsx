import React from "react";
import AuthListener from "../components/AuthListener";
import PostContainer from "./components/PostContainer";

const Post = () => {
  return (
    <div>
      <AuthListener />
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <PostContainer id={index} key={index} />
        ))}
    </div>
  );
};

export default Post;
