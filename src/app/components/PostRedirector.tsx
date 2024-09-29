"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const PostRedirector = () => {
  useEffect(() => {
    redirect("/post");
  }, []);

  return null;
};

export default PostRedirector;
