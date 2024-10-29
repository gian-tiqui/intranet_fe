"use client";
import HoverBox from "@/app/components/HoverBox";
import React, { useEffect, useState } from "react";
import PostContainer from "../../posts/components/PostContainer";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import usePostUriStore from "@/app/store/usePostUri";
import { MinMax, Post } from "@/app/types/types";
import { decodeUserData, fetchPublicPosts } from "@/app/functions/functions";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import NoPosts from "./NoPosts";
import Shortcuts from "./Shortcuts";

const GeneralBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [maxNum, setMaxNum] = useState<number>(3);
  const [direction, setDirection] = useState<string>("desc");
  const [minMax, setMinMax] = useState<MinMax>({ min: 0, max: 2 });
  const [totalPosts, setTotalPosts] = useState<number>(0);

  const { data: _bulletinPosts, isLoading } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [bulletinPosts, setBulletinPosts] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();

  const isLastPage = minMax.max >= totalPosts;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUri = `${API_BASE}/post?public=true&search=${uriPost}&lid=${
          decodeUserData()?.lid
        }&direction=${direction}&offset=${minMax.min}&limit=${minMax.max}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setBulletinPosts(response.data.posts);
        setTotalPosts(response.data.count);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [uriPost, direction, minMax]);

  useEffect(() => {
    if (_bulletinPosts) {
      setBulletinPosts(_bulletinPosts.posts);
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
          {bulletinPosts.length > 0 ? (
            <>
              <Shortcuts
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {bulletinPosts.slice(0, maxNum).map((post) => (
                <PostContainer id={post.pid} key={post.pid} generalPost />
              ))}
              {bulletinPosts.length > 3 && (
                <HoverBox className="py-1 px-2 cursor-pointer rounded grid place-content-center">
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
                limit={2}
                totalPosts={totalPosts} // Use dynamic totalPosts
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

export default GeneralBulletin;
