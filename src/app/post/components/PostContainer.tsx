"use client";
import Image from "next/image";
import React from "react";

interface Props {
  id: number;
}

const PostContainer: React.FC<Props> = ({ id }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-9 w-9 bg-red-500 rounded-full"></div>
        <h1 className="text-lg font-semibold">Westlake User</h1>
      </div>

      <h1 className="text-xl font-bold">Title: Post number {Number(id) + 1}</h1>

      <h4 className="text-xs mb-2">Date here</h4>
      <p className="text-sm mb-2 max-w-full">
        Descriptionnnnnnnnnnnnnnnnnnnnnnnnn nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
        nnnnnnn
        nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
      </p>
      <Image
        className="h-96 w-full bg-neutral-100 mb-6"
        src="https://nextjs.org/icons/next.svg"
        alt="Next.js logo"
        height={0}
        width={0}
        priority
      />
      <div className="h-10 flex flex-grow w-full mb-3">
        <div className="w-full">
          <p className="cursor-pointer">Like</p>
        </div>
        <div className="w-full">
          <p className="text-center cursor-pointer">Comment</p>
        </div>
        <div className="w-full">
          <p className="text-end cursor-pointer">Share</p>
        </div>
      </div>
    </div>
  );
};

export default PostContainer;
