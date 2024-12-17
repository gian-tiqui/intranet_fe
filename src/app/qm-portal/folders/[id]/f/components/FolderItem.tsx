import useDeleteModalStore from "@/app/store/deleteModalStore";
import usePostIdStore from "@/app/store/postId";
import { Post } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React from "react";

interface State {
  post: Post;
}

const FolderItem: React.FC<State> = ({ post }) => {
  const router = useRouter();
  const { setPostId } = usePostIdStore();
  const { setShowDeleteModal } = useDeleteModalStore();

  const handleDeleteClicked = () => {
    if (!post) return;

    setPostId(post?.pid);
    setShowDeleteModal(true);
  };

  const handleDoubleClick = () => {
    router.push(`/posts/${post.pid}`);
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="w-full h-12 flex items-center px-2 justify-between rounded border border-black shadow cursor-pointer hover:bg-neutral-50 dark:border-white dark:hover:bg-neutral-950"
    >
      <div className="flex gap-1">
        <Icon icon={"mynaui:file"} className="h-6 w-6" />
        <p>{post.title}</p>
      </div>
      <div className="rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-600 p-2">
        <Icon
          icon={"material-symbols:delete-outline"}
          className="h-5 w-5"
          onClick={handleDeleteClicked}
        />
      </div>
    </div>
  );
};

export default FolderItem;
