"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import PostContainer from "./PostContainer";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import { Post } from "@/app/types/types";
import axios from "axios";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import usePostUriStore from "@/app/store/usePostUri";
import apiClient from "@/app/http-common/apiUrl";

const MainPost = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);
  const { uriPost } = usePostUriStore();

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(
          `${API_BASE}/post?search=${uriPost}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            },
          }
        );

        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [uriPost]);

  return (
    <div>
      {posts.slice(0, maxNum).map((post) => (
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
