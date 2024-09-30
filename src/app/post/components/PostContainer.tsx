"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import React from "react";

interface Props {
  id: number;
}

const PostContainer: React.FC<Props> = ({ id }) => {
  return (
    <div>
      <div className="flex items-start gap-2 mb-2">
        <div className="h-9 w-9 bg-gray-300 rounded-full"></div>
        <h1 className="text-lg font-semibold">Westlake User {id}</h1>
      </div>

      <h1 className="text-xl font-bold">Lorem Ipsum</h1>
      <h4 className="text-xs mb-3">September 30, 2024</h4>

      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-2" />

      <p className="text-md mb-2 max-w-full">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
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
          <Icon icon={"material-symbols:comment-outline"} className="h-6 w-6" />

          <p className="text-center cursor-pointer">Comment</p>
        </div>
        <div className="w-full gap-3 flex justify-center dark:hover:bg-neutral-700 py-2">
          <Icon icon={"fluent-mdl2:share"} className="h-6 w-6" />

          <p className="text-end cursor-pointer">Share</p>
        </div>
      </div>
    </div>
  );
};

export default PostContainer;
