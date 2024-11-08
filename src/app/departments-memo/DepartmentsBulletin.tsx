"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import PostContainer from "../posts/components/PostContainer";
import { Post } from "../types/types";
import usePostUriStore from "../store/usePostUri";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData, fetchPosts } from "../functions/functions";
import apiClient from "../http-common/apiUrl";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../posts/components/PostSkeleton";
import NoPosts from "../bulletin/components/NoPosts";
import Shortcuts from "../bulletin/components/Shortcuts";

const DepartmentsBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);
  const [minMax, setMinMax] = useState({ min: 0, max: 2 });
  const [direction, setDirection] = useState<string>("desc");
  const [departmentsPost, setDepartmentsPost] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const { data: _bulletinPosts, isLoading } = useQuery({
    queryKey: ["private_posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const isLastPage = minMax.max >= totalPosts;

  useEffect(() => {
    const fetchDepartmentPosts = async () => {
      try {
        const apiUri = `${API_BASE}/post?deptId=${
          decodeUserData()?.deptId
        }&userIdComment=${decodeUserData()?.sub}&search=${uriPost}&lid=${
          decodeUserData()?.lid
        }&direction=${direction}&offset=${minMax.min}&limit=${minMax.max}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setDepartmentsPost(response.data.posts);
        setTotalPosts(response.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepartmentPosts();
  }, [uriPost, direction, minMax]);

  useEffect(() => {
    if (_bulletinPosts) {
      setDepartmentsPost(_bulletinPosts.posts);
      setTotalPosts(_bulletinPosts.count);
    }
  }, [_bulletinPosts]);

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  return (
    <div>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {departmentsPost.length > 0 ? (
            <>
              <Shortcuts
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={3}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {departmentsPost.slice(0, maxNum).map((post) => (
                <PostContainer id={post.pid} key={post.pid} generalPost />
              ))}

              {departmentsPost.length > maxNum && (
                <HoverBox className=" py-1 px-2 cursor-pointer rounded grid place-content-center">
                  <button
                    onClick={() => setMaxNum((prevMax) => prevMax + 3)}
                    className="w-36 h-10 rounded-md my-5 hover:bg-gray-300 dark:hover:bg-neutral-800"
                  >
                    Show more
                  </button>
                </HoverBox>
              )}

              <Shortcuts
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={3}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />
            </>
          ) : (
            <NoPosts />
          )}
        </>
      )}
    </div>
  );
};

export default DepartmentsBulletin;
