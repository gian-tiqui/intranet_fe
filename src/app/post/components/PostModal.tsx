"use client";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import useShowPostStore from "@/app/store/showPostStore";
import React, { useEffect } from "react";

const PostModal = () => {
  const { setVisible } = useShowPostStore();
  const { setIsCollapsed } = useToggleStore();

  useEffect(() => {
    setIsCollapsed(true);
    return () => setIsCollapsed(false);
  }, [setIsCollapsed]);

  return (
    <div
      onClick={() => setVisible(false)}
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
    >
      <div className="h-96 w-96 bg-white dark:bg-neutral-900"></div>
    </div>
  );
};

export default PostModal;
