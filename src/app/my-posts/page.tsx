import React from "react";
import MyPosts from "./components/MyPosts";
import AuthListener from "../components/AuthListener";

const MyPostsPage = () => {
  return (
    <div>
      <AuthListener />
      <MyPosts />
    </div>
  );
};

export default MyPostsPage;
