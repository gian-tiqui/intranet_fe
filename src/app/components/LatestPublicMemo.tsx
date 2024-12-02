import Link from "next/link";
import React from "react";
import { Post } from "../types/types";
import PostCell from "./animation/PostCell";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  posts: Post[];
}

const LatestPublicMemo: React.FC<Props> = ({ posts }) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="w-full grid gap-1">
      <p className="text-lg font-bold mb-6">Latest public memos</p>
      <div className="grid md:grid-cols-3 gap-1">
        <div className="max-h-82 w-full md:col-span-2 bg-white dark:bg-neutral-900 shadow">
          <PostCell post={posts[0]} first={true} />
        </div>
        <div className="md:col-span-1 grid grid-cols-1 gap-1">
          <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
            {" "}
            <PostCell post={posts[1]} />
          </div>
          <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
            {" "}
            <PostCell post={posts[2]} />
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-1 mb-12">
        <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
          <PostCell post={posts[3]} />
        </div>
        <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
          <PostCell post={posts[4]} />
        </div>
        <div className="h-40 bg-white w-full  dark:bg-neutral-900 shadow">
          <PostCell post={posts[5]} />
        </div>
      </div>
      {posts.length > 0 && (
        <div className="flex justify-center">
          <Link
            href={"/bulletin"}
            className="bg-white dark:bg-neutral-900 flex justify-center items-center hover:shadow hover:bg-gray-100 dark:hover:bg-neutral-700 w-32 h-10 rounded font-bold text-sm "
          >
            <Icon icon={""} />
            View more
          </Link>
        </div>
      )}
    </div>
  );
};

export default LatestPublicMemo;
