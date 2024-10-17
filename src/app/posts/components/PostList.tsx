"use client";
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import { GroupedPosts, Post } from "@/app/types/types";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import HoverBox from "@/app/components/HoverBox";
import Link from "next/link";
import usePosts from "@/app/custom-hooks/posts";
import PostListSkeleton from "./PostListSkeleton";
import NoPosts from "./NoPosts";
import useBulletin from "@/app/custom-hooks/bulletin";

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
}

const PostList: React.FC<Props> = ({ selectedVis }) => {
  const posts = usePosts();
  const allPosts = useBulletin();

  // Use posts or allPosts depending on selectedVis
  const groupedPosts = useMemo(
    () => groupPostsByDate(selectedVis === "dept" ? posts : allPosts),
    [selectedVis, posts, allPosts]
  );

  const [maxNum, setMaxNum] = useState<number>(2);

  const showMore = () => {
    setMaxNum((prevMax) => prevMax + 3);
  };

  if (!posts) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0 && allPosts.length === 0) {
    return <NoPosts />;
  }

  return (
    <>
      <div>
        {Object.keys(groupedPosts)
          .slice(0, maxNum)
          .map((date) => (
            <MotionTemplate key={date}>
              <div className="px-3 mb-8">
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
