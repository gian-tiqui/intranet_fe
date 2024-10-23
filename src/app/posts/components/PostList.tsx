import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { GroupedPosts, Post } from "@/app/types/types";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import HoverBox from "@/app/components/HoverBox";
import Link from "next/link";
import PostListSkeleton from "./PostListSkeleton";
import NoPosts from "./NoPosts";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts, fetchPublicPosts } from "@/app/functions/functions";

const groupPostsByDate = (posts: Post[]) => {
  return posts.reduce((groups: GroupedPosts, post: Post) => {
    const date = format(new Date(post.createdAt), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(post);
    return groups;
  }, {});
};

interface Props {
  selectedVis: string;
  isMobile: boolean;
}

const Skeleton = () => {
  return Array(3)
    .fill(0)
    .map((_, index) => (
      <div key={index} className="px-4 grid gap-2 mb-6">
        <div className="w-1/3 animate-pulse h-4 bg-gray-300 rounded"></div>
        <div className="w-full animate-pulse h-4 bg-gray-300 rounded"></div>
        <div className="w-full animate-pulse h-4 bg-gray-300 rounded"></div>
        <div className="w-full animate-pulse h-4 bg-gray-300 rounded"></div>
      </div>
    ));
};

const PostList: React.FC<Props> = ({ selectedVis, isMobile }) => {
  const { data: _posts, isLoading } = useQuery({
    queryKey: ["private_posts"],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: _allPosts } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (_posts) setPosts(_posts);
  }, [_posts]);

  useEffect(() => {
    if (_allPosts) setAllPosts(_allPosts);
  }, [_allPosts]);

  const { isCollapsed, setIsCollapsed } = useToggleStore();

  const groupedPosts = useMemo(
    () => groupPostsByDate(selectedVis === "dept" ? posts : allPosts),
    [selectedVis, posts, allPosts]
  );

  const [maxNum, setMaxNum] = useState<number>(2);

  const showMore = () => {
    setMaxNum((prevMax) => prevMax + 3);
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (!posts) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0 && allPosts?.length === 0) {
    return <NoPosts />;
  }

  return (
    <>
      <div>
        {Object.keys(groupedPosts)
          .slice(0, maxNum)
          .map((date) => (
            <MotionTemplate key={date}>
              <div
                onClick={
                  isMobile ? () => setIsCollapsed(!isCollapsed) : undefined
                }
                className="px-3 mb-8"
              >
                <div key={date}>
                  <h2 className="text-xs font-semibold ms-2 mb-2">
                    {format(new Date(date), "MMMM dd, yyyy")}
                  </h2>
                  <div className="flex flex-col">
                    {groupedPosts[date].map((post, index) => (
                      <Link href={`/posts/${post.pid}`} key={index}>
                        <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-2 cursor-pointer rounded">
                          <p>{post.title || "Untitled"}</p>
                        </HoverBox>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </MotionTemplate>
          ))}
      </div>

      <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 py-1 px-2 mx-4 cursor-pointer rounded">
        <button onClick={showMore} className="w-full">
          Show more
        </button>
      </HoverBox>
    </>
  );
};

export default PostList;
