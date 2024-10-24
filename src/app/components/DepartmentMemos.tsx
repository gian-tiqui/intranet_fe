import Link from "next/link";
import React from "react";
import { Post } from "../types/types";
import PostCell from "./animation/PostCell";

interface Props {
  posts: Post[];
}

const DepartmentMemos: React.FC<Props> = ({ posts }) => {
  return (
    <div className="w-full">
      <p className="text-lg font-bold mb-6">Memos for your department</p>
      <div className="grid md:grid-cols-3 gap-1 mb-12">
        <div className="h-40 bg-white dark:bg-neutral-900 shadow">
          <PostCell post={posts[0]} />
        </div>
        <div className="h-40 bg-white dark:bg-neutral-900 shadow">
          <PostCell post={posts[1]} />
        </div>
        <div className="h-40 bg-white dark:bg-neutral-900 shadow">
          <PostCell post={posts[2]} />
        </div>
      </div>
      <div className="flex justify-center">
        <Link
          href={"/departments-memo"}
          className="bg-white dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-700 hover:shadow w-32 h-10 rounded font-bold text-sm grid place-content-center"
        >
          View more
        </Link>
      </div>
    </div>
  );
};

export default DepartmentMemos;
