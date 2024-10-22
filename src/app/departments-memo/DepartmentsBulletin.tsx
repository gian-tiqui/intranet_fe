"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import PostContainer from "../posts/components/PostContainer";
import { Post } from "../types/types";
import usePostUriStore from "../store/usePostUri";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData, fetchPublicPosts } from "../functions/functions";
import apiClient from "../http-common/apiUrl";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../posts/components/PostSkeleton";

const DepartmentsBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);

  const [departmentsPost, setDepartmentsPost] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();

  const { data: _bulletinPosts, isLoading } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    const fetchDepartmentPosts = async () => {
      try {
        const apiUri = `${API_BASE}/post?deptId=${
          decodeUserData()?.deptId
        }&userIdComment=${decodeUserData()?.sub}&search=${uriPost}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setDepartmentsPost(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepartmentPosts();
  }, [uriPost]);

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  useEffect(() => {
    if (_bulletinPosts) setDepartmentsPost(_bulletinPosts);
  }, [_bulletinPosts]);

  return (
    <div>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {departmentsPost.slice(0, maxNum).map((post) => (
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
        </>
      )}
    </div>
  );
};

export default DepartmentsBulletin;
