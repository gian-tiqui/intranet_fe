import { Post } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  post: Post;
}

const FolderItem: React.FC<Props> = ({ post }) => {
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push(`/posts/${post.pid}`);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="flex flex-col w-full px-3 cursor-default"
    >
      <div className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-700 px-3">
        <div className="flex items-center gap-3 py-3">
          <Icon icon={"mdi:file-outline"} className="h-7 w-7" />
          <p className="font-semibold text-sm">{post.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-500">
            <Icon icon={"material-symbols:download"} className="h-6 w-6" />
          </div>
          <div className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-500">
            <Icon
              icon={"material-symbols:delete-outline"}
              className="h-6 w-6"
            />{" "}
          </div>
        </div>
      </div>

      <hr className="w-full border-b-0 border-black dark:border-white" />
    </div>
  );
};

export default FolderItem;
