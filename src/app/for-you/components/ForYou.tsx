"use client";

import { API_BASE } from "@/app/bindings/binding";
import NoPosts from "@/app/bulletin/components/NoPosts";
import Shortcuts from "@/app/bulletin/components/Shortcuts";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import PostContainer from "@/app/posts/components/PostContainer";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import { Post, RetPost } from "@/app/types/types";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";

const ForYou = () => {
  const [direction, setDirection] = useState<string>("desc");
  const [minMax, setMinMax] = useState<{ min: number; max: number }>({
    min: 0,
    max: 2,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [data, setData] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response: AxiosResponse<RetPost> = await apiClient.get(
          `${API_BASE}/post/level/${decodeUserData()?.lid}?deptId=${
            decodeUserData()?.deptId
          }&offset=${minMax.min}&limit=${minMax.max}&direction=${direction}`
        );

        setTotalPosts(response.data.count);
        setData(response.data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [minMax, direction]);

  const isLastPage = minMax.max >= totalPosts;

  return (
    <div>
      {isLoading ? (
        <PostSkeleton />
      ) : (
        <>
          {data && data.length > 0 ? (
            <>
              <Shortcuts
                min={minMax.min}
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {data.map((post) => (
                <PostContainer
                  id={post.pid}
                  key={post.pid}
                  generalPost
                  type="for-you"
                />
              ))}

              <Shortcuts
                min={minMax.min}
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
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

export default ForYou;
