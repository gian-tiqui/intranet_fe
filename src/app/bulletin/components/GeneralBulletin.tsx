"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import PostContainer from "../../posts/components/PostContainer";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import useBulletin from "@/app/custom-hooks/bulletin";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import usePostUriStore from "@/app/store/usePostUri";
import { Post } from "@/app/types/types";

const GeneralBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);

  const [bulletinPosts, setBulletinPosts] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUri = `${API_BASE}/post?public=true&search=${uriPost}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setBulletinPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [uriPost]);

  const posts = useBulletin();

  useEffect(() => {
    setBulletinPosts(posts);
  }, [posts]);

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  return (
    <div>
      {bulletinPosts.slice(0, maxNum).map((post) => (
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

export default GeneralBulletin;
