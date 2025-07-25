"use client";
import React, { useEffect, useState } from "react";
import PostContainer from "../../posts/components/PostContainer";
import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { MinMax, Post } from "@/app/types/types";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import Shortcuts from "@/app/bulletin/components/Shortcuts";
import ShortcutSkeleton from "@/app/bulletin/components/ShortcutSkeleton";
import { decodeUserData } from "@/app/functions/functions";
import NoPosts from "@/app/bulletin/components/NoPosts";

const MyPosts = () => {
  const [direction, setDirection] = useState<string>("desc");
  const [minMax, setMinMax] = useState<MinMax>({ min: 0, max: 2 });
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<number>();
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (decodeUserData()) setUserId(decodeUserData()?.sub);
  }, []);

  const isLastPage = minMax.max >= totalPosts;

  useEffect(() => {
    const fetchMyPosts = async () => {
      setLoading(true);
      if (!userId) return;

      try {
        const apiUri = `${API_BASE}/post/my-posts?userId=${userId}&direction=${direction}&offset=${
          minMax.min
        }&limit=${minMax.max}&isPublished=${1}`;

        const response = await apiClient.get(apiUri);

        setMyPosts(response.data.posts);
        setTotalPosts(response.data.count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [direction, minMax, userId]);

  return (
    <div>
      {isLoading ? (
        <>
          <ShortcutSkeleton />
          <PostSkeleton />
          <ShortcutSkeleton />
        </>
      ) : (
        <>
          {myPosts.length > 0 ? (
            <>
              <Shortcuts
                min={minMax.min}
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {myPosts.map((post) => (
                <PostContainer
                  id={post.pid}
                  key={post.pid}
                  generalPost
                  type="myPosts"
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

export default MyPosts;
