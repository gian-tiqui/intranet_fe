"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import PostContainer from "./PostContainer";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import usePosts from "@/app/custom-hooks/posts";
import { Post } from "@/app/types/types";
import usePostUriStore from "@/app/store/usePostUri";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";

const MainPost = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);
  const [mainPosts, setMainPosts] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUri = `${API_BASE}/post?deptId=${
          decodeUserData()?.deptId
        }&userIdComment=${decodeUserData()?.sub}&search=${uriPost}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setMainPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [uriPost]);

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  const posts = usePosts();

  useEffect(() => {
    setMainPosts(posts);
  }, [posts]);

  if (posts.length === 0) {
    return (
      <div className="w-full h-full grid place-content-center">
        <p className="font-semibold mt-20">No memos to show yet</p>
      </div>
    );
  }

  return (
    <div>
      {mainPosts.slice(0, maxNum).map((post) => (
        <PostContainer id={post.pid} key={post.pid} generalPost />
      ))}
      <HoverBox className=" py-1 px-2 cursor-pointer rounded grid place-content-center">
        <button
          onClick={() => setMaxNum((prevMax) => prevMax + 3)}
          className="w-36 h-10 rounded-md my-5 hover:bg-gray-300 dark:hover:bg-neutral-800"
        >
          Show more
        </button>
      </HoverBox>
    </div>
  );
};

export default MainPost;
