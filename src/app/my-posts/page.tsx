import React from "react";
import MyPosts from "./components/MyPosts";
import AuthListener from "../components/AuthListener";

const MyPostsPage = () => {
  return (
    <>
      <AuthListener />
      <MyPosts />
    </>
  );
};

export default MyPostsPage;
