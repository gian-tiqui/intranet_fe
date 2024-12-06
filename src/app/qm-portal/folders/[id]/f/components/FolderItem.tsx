import { Post } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React from "react";

interface State {
  post: Post;
}

const FolderItem: React.FC<State> = ({ post }) => {
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/posts/${post.pid}`);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-12 flex items-center px-2 gap-1 rounded border border-black shadow cursor-pointer hover:bg-neutral-50 dark:border-white dark:hover:bg-neutral-950"
    >
      <Icon icon={"mynaui:file"} className="h-6 w-6" />
      <p>{post.title}</p>
    </div>
  );
};

export default FolderItem;
