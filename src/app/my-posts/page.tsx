import React from "react";
import AuthListener from "../components/AuthListener";
import dynamic from "next/dynamic";

const MyPosts = dynamic(() => import("./components/MyPosts"), { ssr: false });

const MyPostsPage = () => {
  return (
    <>
      <AuthListener />
      <MyPosts />
    </>
  );
};

export default MyPostsPage;
