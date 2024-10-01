import React from "react";
import AuthListener from "../components/AuthListener";
import MainPost from "./components/MainPost";

const Post = () => {
  return (
    <div>
      <AuthListener />
      <MainPost />
    </div>
  );
};

export default Post;
