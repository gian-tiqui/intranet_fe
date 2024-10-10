import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Post } from "@/app/types/types";
import { formatDate } from "date-fns";
import SmallToLarge from "@/app/components/animation/SmallToLarge";
import { AnimatePresence } from "framer-motion";
import usePostIdStore from "@/app/store/postId";
import useEditModalStore from "@/app/store/editModal";
import useDeletePostStore from "@/app/store/deletePost";
import useAdminHiderStore from "@/app/store/adminOpacitor";

const PostTr: React.FC<Post> = (post) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const { setPostId } = usePostIdStore();
  const { setShowEditModal } = useEditModalStore();
  const { setDeletePostModalShown } = useDeletePostStore();
  const { setAShown } = useAdminHiderStore();

  const handleOptionClicked = () => {
    setPostId(post.pid);
  };

  const handleDeleteClicked = () => {
    setAShown(true);
    setDeletePostModalShown(true);
  };

  const handleUpdateModalClicked = () => {
    setShowEditModal(true);
  };

  useEffect(() => {
    const handleClick = () => {
      if (showOptions) {
        setShowOptions(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showOptions]);

  return (
    <tr
      key={post.pid}
      className="border-b last:border-b-0 border-gray-300 dark:border-neutral-900"
    >
      <td className="text-center">{post.title}</td>
      <td className="text-center break-all">{post.message}</td>
      <td className="text-center">
        {post.user?.firstName} {post.user?.lastName}
      </td>
      <td className="text-center">{post.department.departmentName}</td>
      <td className="text-center">
        {formatDate(post.createdAt, "MMMM dd, yyyy")}
      </td>
      <td className="text-center">
        {formatDate(post.updatedAt, "MMMM dd, yyyy")}
      </td>
      <td
        onClick={handleOptionClicked}
        className="py-4 px-4 border-b border-gray-300 dark:border-neutral-900
                   text-center"
      >
        <Icon
          onClick={() => setShowOptions(!showOptions)}
          icon={"simple-line-icons:options"}
          className="mx-auto h-7 w-7 p-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-neutral-600 rounded-full"
        />
        <AnimatePresence>
          {showOptions && (
            <SmallToLarge>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex flex-col w-32 right-0 items-start p-2 absolute bg-neutral-200 border border-gray-300 rounded-lg dark:bg-neutral-800 dark:border-gray-900"
              >
                <button className="hover:bg-gray-300 px-2 dark:hover:bg-gray-900 rounded w-full py-2 flex items-center gap-1">
                  <Icon icon={"hugeicons:view"} className="h-5 w-5" />
                  View
                </button>
                <button
                  onClick={handleUpdateModalClicked}
                  className="hover:bg-gray-300 px-2 dark:hover:bg-gray-900 rounded w-full py-2 flex items-center gap-1"
                >
                  <Icon icon={"bx:edit"} className="h-5 w-5" />
                  Update
                </button>
                <button
                  onClick={handleDeleteClicked}
                  className="hover:bg-gray-300 px-2 dark:hover:bg-gray-900 rounded w-full py-2 flex items-center gap-1"
                >
                  <Icon
                    icon={"material-symbols:delete-outline"}
                    className="h-5 w-5"
                  />
                  Delete
                </button>
              </div>
            </SmallToLarge>
          )}
        </AnimatePresence>
      </td>
    </tr>
  );
};

export default PostTr;
