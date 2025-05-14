"use client";
import React, { useEffect, useState } from "react";
import useHideSearchBarStore from "@/app/store/hideSearchBar";
import PostContainer from "../posts/components/PostContainer";
import { Post } from "../types/types";
import usePostUriStore from "../store/usePostUri";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import apiClient from "../http-common/apiUrl";
import PostSkeleton from "../posts/components/PostSkeleton";
import NoPosts from "../bulletin/components/NoPosts";
import Shortcuts from "../bulletin/components/Shortcuts";
import ShortcutSkeleton from "../bulletin/components/ShortcutSkeleton";

const DepartmentsBulletin = () => {
  const { setSearchBarHidden } = useHideSearchBarStore();
  const [minMax, setMinMax] = useState({ min: 0, max: 2 });
  const [direction, setDirection] = useState<string>("desc");
  const [departmentsPost, setDepartmentsPost] = useState<Post[]>([]);
  const { uriPost } = usePostUriStore();
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [isLoading, setLoading] = useState<boolean>(false);

  const isLastPage = minMax.max >= totalPosts;

  useEffect(() => {
    const fetchDepartmentPosts = async () => {
      try {
        setLoading(true);
        const apiUri = `${API_BASE}/post?deptId=${
          decodeUserData()?.deptId
        }&userIdComment=${decodeUserData()?.sub}&search=${uriPost}&lid=${
          decodeUserData()?.lid
        }&direction=${direction}&offset=${minMax.min}&limit=${
          minMax.max
        }&isPublished=${1}`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        setDepartmentsPost(response.data.posts);
        setTotalPosts(response.data.count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentPosts();
  }, [uriPost, direction, minMax]);

  useEffect(() => {
    setSearchBarHidden(true);

    return () => setSearchBarHidden(false);
  }, [setSearchBarHidden]);

  return (
    <div>
      {isLoading ? (
        <>
          <>
            <ShortcutSkeleton />
            <PostSkeleton />
            <ShortcutSkeleton />
          </>
        </>
      ) : (
        <>
          {departmentsPost.length > 0 ? (
            <>
              <Shortcuts
                min={minMax.min}
                setDirection={setDirection}
                setMinMax={setMinMax}
                limit={3}
                totalPosts={totalPosts}
                isLastPage={isLastPage}
              />

              {departmentsPost.map((post) => (
                <PostContainer
                  id={post.pid}
                  key={post.pid}
                  generalPost
                  type="department"
                />
              ))}

              <Shortcuts
                min={minMax.min}
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
