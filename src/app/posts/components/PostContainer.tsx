"use client";
import usePost from "@/app/custom-hooks/post";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import PostSkeleton from "./PostSkeleton";
import Comments from "./Comments";
import { PostComment } from "@/app/types/types";

/*
 * @TODO
 * Loading components initialization starts here
 *
 */

interface Props {
  id: number;
  generalPost?: boolean;
}

const PostContainer: React.FC<Props> = ({ id, generalPost = false }) => {
  const router = useRouter();
  const post = usePost(id);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post) {
      setLoading(false);
    }
  }, [post]);

  const handleClick = () => {
    router.push(`/posts/${id}`);
  };

  if (loading) {
    return <PostSkeleton />;
  }

  return (
    <>
      <div
        onClick={generalPost ? handleClick : undefined}
        className={`${generalPost && "cursor-pointer"}`}
      >
        <div className="flex items-start gap-2 mb-2">
          <div className="h-9 w-9 bg-gray-300 rounded-full"></div>
          <h1 className="text-lg font-semibold">
            {post?.user?.firstName} {post?.user?.lastName}
          </h1>
        </div>

        <h1 className="text-xl font-bold">{post?.title}</h1>
        <h4 className="text-xs mb-3">
          {post?.createdAt
            ? format(new Date(post.createdAt), "MMMM dd, yyyy")
            : "Unknown Date"}
        </h4>

        <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-2" />

        <p className="text-md mb-2 max-w-full">{post?.message}</p>
        <Image
          className="h-96 w-full bg-neutral-100 mb-6"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          height={0}
          width={0}
          priority
        />
        <div className="flex flex-grow w-full mb-6">
          <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2">
            <Icon icon={"mdi:like-outline"} className="h-6 w-6" />
            <p className="cursor-pointer">Like</p>
          </div>
          <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2">
            <Icon
              icon={"material-symbols:comment-outline"}
              className="h-6 w-6"
            />

            <p className="text-center cursor-pointer">Comment</p>
          </div>
          <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2">
            <Icon icon={"fluent-mdl2:share"} className="h-6 w-6" />

            <p className="text-end cursor-pointer">Share</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-6" />
      {post?.comments && (
        <Comments comments={post?.comments as PostComment[]} postId={id} />
      )}
    </>
  );
};

export default PostContainer;
