import { Post } from "@/app/types/types";
import React from "react";
import Image from "next/image"; // Assuming you're using Next.js for optimized image loading
import dayjs from "dayjs"; // For formatting the date

interface Props {
  post: { post: Post };
}

const HistoryItem: React.FC<Props> = ({ post }) => {
  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-md space-y-3">
      {post.post.imageLocations && (
        <div className="w-full h-64 rounded-md overflow-hidden">
          <Image
            src={`http://localhost:8080/uploads/${post.post.imageLocations[0].imageLocation}`}
            alt="Post Image"
            layout="responsive"
            width={700}
            height={400}
            objectFit="cover"
            className="rounded-md"
          />
        </div>
      )}

      {/* Title & Message */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {post.post.title || "No Title"}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {post.post.message || "No message provided."}
        </p>
      </div>

      {/* Footer: Created At, Public/Private Status */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>{dayjs(post.post.createdAt).format("MMMM D, YYYY h:mm A")}</span>
        <span
          className={`px-2 py-1 rounded-md text-xs ${
            post.post.public
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {post.post.public ? "Public" : "Private"}
        </span>
      </div>
    </div>
  );
};

export default HistoryItem;
