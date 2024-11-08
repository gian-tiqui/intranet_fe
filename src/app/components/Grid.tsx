"use client";
import { fetchPosts, fetchPublicPosts } from "@/app/functions/functions";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import LatestPublicMemo from "./LatestPublicMemo";
import DepartmentMemos from "./DepartmentMemos";
import PostGridSkeleton from "./PostGridSkeleton";
import PostGridSkeleton2 from "./PostGridSkeleton2";
import Cookies from "js-cookie";
import Welcome from "./Welcome";
import { INTRANET } from "../bindings/binding";
import EaseString from "../login/components/EaseString";

const Grid = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: _allPosts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const {
    data: _posts,
    isLoading: pLoading,
    isError: pError,
  } = useQuery({
    queryKey: ["private_posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  if (!isMounted) return null;

  if (!Cookies.get(INTRANET))
    return (
      <div className="w-full h-screen grid place-content-center">
        <EaseString size="text-xl" word="Hello" />
      </div>
    );

  if (isError) {
    console.log("There was a problem in fetching the public post");
  }

  if (pError) {
    console.log("There was a problem in fetching the private post");
  }

  return (
    <div className="grid gap-20 pb-20">
      <Welcome />
      {isLoading ? (
        <PostGridSkeleton />
      ) : (
        _allPosts && <LatestPublicMemo posts={_allPosts.posts} />
      )}

      {pLoading ? (
        <PostGridSkeleton2 />
      ) : (
        _posts && <DepartmentMemos posts={_posts.posts} />
      )}
    </div>
  );
};

export default Grid;
