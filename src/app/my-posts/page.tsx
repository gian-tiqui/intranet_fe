import React from "react";
import AuthListener from "../components/AuthListener";
import MyPosts from "./components/MyPosts";

const page = () => {
  return (
    <div>
      <AuthListener />
      <MyPosts />
    </div>
  );
};

export default page;
