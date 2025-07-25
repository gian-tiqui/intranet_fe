"use client";
import React, { useEffect, useState } from "react";
import PostContainer from "../../posts/components/PostContainer";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import usePostUriStore from "@/app/store/usePostUri";
import { MinMax, Post } from "@/app/types/types";
import { decodeUserData } from "@/app/functions/functions";
import PostSkeleton from "@/app/posts/components/PostSkeleton";
import NoPosts from "./NoPosts";
import Shortcuts from "./Shortcuts";
import ShortcutSkeleton from "./ShortcutSkeleton";

const GeneralBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [direction, setDirection] = useState<string>("desc");
  const [minMax, setMinMax] = useState<MinMax>({ min: 0, max: 2 });
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [bulletinPosts, setBulletinPosts] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();

  const isLastPage = minMax.max >= totalPosts;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const apiUri = `${API_BASE}/post?public=true&search=${uriPost}&lid=${
          decodeUserData()?.lid
        }&direction=${direction}&offset=${minMax.min}&limit=${
          minMax.max
        }&isPublished=${1}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setBulletinPosts(response.data.posts);
        setTotalPosts(response.data.count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [uriPost, direction, minMax]);

  useEffect(() => {
    setSearchBarHidden(true);
    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

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
          {bulletinPosts.length > 0 ? (
            <>
              <Shortcuts
                min={minMax.min}
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={2}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {bulletinPosts.map((post) => (
                <PostContainer
                  id={post.pid}
                  key={post.pid}
                  generalPost
                  type="general"
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

export default GeneralBulletin;
