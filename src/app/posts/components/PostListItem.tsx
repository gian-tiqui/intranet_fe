import { API_BASE } from "@/app/bindings/binding";
import HoverBox from "@/app/components/HoverBox";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import { Post } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

interface Props {
  post: Post;
}

const PostListItem: React.FC<Props> = ({ post }) => {
  const [showLight, setShowLight] = useState<boolean>(false);

  useEffect(() => {
    const fetchReadStatus = async () => {
      if (!post.pid) return;

      try {
        const response = await apiClient.get(
          `${API_BASE}/monitoring/read-status?userId=${
            decodeUserData()?.sub
          }&postId=${post.pid}`
        );

        setShowLight(response.data.message !== "Read");
      } catch (error) {
        console.log(error);
      }
    };

    if (post.pid) fetchReadStatus();
  }, [post]);

  return (
    <HoverBox className="hover:bg-neutral-200 flex items-center justify-between dark:hover:bg-neutral-800 py-1 px-2 cursor-pointer rounded">
      <div className="flex gap-2">
        <Icon icon={"iconoir:post"} className="h-5 w-5 -rotate-[10deg]" />

        <p>
          {post.title
            ? post.title[0].toUpperCase() + post.title.substring(1)
            : "Untitled"}
        </p>
      </div>
      {showLight && (
        <div className="h-2 w-2 bg-green-500 dark:bg-blue-400 rounded-full"></div>
      )}
    </HoverBox>
  );
};

export default PostListItem;
