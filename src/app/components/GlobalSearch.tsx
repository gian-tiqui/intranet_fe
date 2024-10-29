import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { decodeUserData, fetchPublicPosts } from "../functions/functions";
import { Post } from "../types/types";
import { API_BASE, INTRANET } from "../bindings/binding";
import apiClient from "../http-common/apiUrl";
import { useRouter } from "next/navigation";

const GlobalSearch = () => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const [publicPosts, setPublicPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const {
    data: _publicPosts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const apiUri = `${API_BASE}/post?public=true&search=${debouncedSearch}&lid=${
          decodeUserData()?.lid
        }`;

        const response = await apiClient.get(apiUri, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });

        console.log(response.data);

        setPublicPosts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearch) {
      fetchPosts();
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (_publicPosts) setPublicPosts(_publicPosts.posts);
  }, [_publicPosts]);

  if (isError) {
    console.log(error);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center" ref={ref}>
      <div
        onClick={() => setShowSuggestions(true)}
        className="w-full bg-white dark:bg-neutral-900 h-14 shadow px-6 gap-5 rounded-full flex items-center"
      >
        <Icon icon={"line-md:search-twotone"} className="h-6 w-6" />
        <input
          placeholder="Search something..."
          className="bg-inherit w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />}
      </div>
      {showSuggestions &&
        (!isLoading ? (
          <div className="p-2 bg-white dark:bg-neutral-900 absolute w-[90%] mt-14 rounded-b-xl h-52 overflow-y-auto flex flex-col gap-1">
            {publicPosts && publicPosts.length > 0 ? (
              publicPosts.map((post) => (
                <div
                  key={post.pid}
                  onClick={() => router.push(`/posts/${post.pid}`)}
                  className="w-full border dark:border-neutral-800 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700 py-4 rounded flex items-center px-4"
                >
                  <p className="truncate">
                    {post.title} - <span>{post.message}</span>
                  </p>
                </div>
              ))
            ) : (
              <div className="grid place-content-center h-full">
                <p className="text-center">No results to show.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2 bg-white dark:bg-neutral-900 absolute w-[90%] mt-14 rounded-b-xl h-52 overflow-y-auto grid gap-1">
            <div className="w-full animate-pulse bg-gray-300 h-10 rounded p-4"></div>
            <div className="w-full animate-pulse bg-gray-300 h-10 rounded p-4"></div>
            <div className="w-full animate-pulse bg-gray-300 h-10 rounded p-4"></div>
            <div className="w-full animate-pulse bg-gray-300 h-10 rounded p-4"></div>
            <div className="w-full animate-pulse bg-gray-300 h-10 rounded p-4"></div>
            <div className="w-full animate-pulse bg-gray-300 h-10 rounded p-4"></div>
          </div>
        ))}
    </div>
  );
};

export default GlobalSearch;
