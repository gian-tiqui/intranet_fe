import React from "react";
import { Post } from "../types/types";
import { Image } from "primereact/image";
import bluePost from "../assets/blue-post.png";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import useEditModalStore from "../store/editModal";
import usePostIdStore from "../store/postId";

interface Props {
  post: Post;
}

const PostDraft: React.FC<Props> = ({ post }) => {
  const { setShowEditModal } = useEditModalStore();
  const { setPostId } = usePostIdStore();

  return (
    <div className="w-full bg-white dark:bg-neutral-900 hover:shadow-md border border-gray-200 dark:border-neutral-700 rounded-xl cursor-pointer flex justify-between items-center px-6 py-4 transition duration-200">
      <div className="flex items-center gap-3">
        <Image
          src={bluePost.src}
          alt="drafts-folder-icon"
          className="h-7 w-7"
        />
        <p className="font-medium text-blue-700 dark:text-blue-300 text-lg truncate max-w-[10rem]">
          {post.title}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Created at</p>
        <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div>
        <p className="text-xs mb-1 text-gray-500 dark:text-gray-400">
          Shared to
        </p>
        <div className="flex items-center gap-1">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Avatar
                key={index}
                label="TE"
                shape="circle"
                className="h-8 w-8 bg-blue-600 text-white text-xs"
              />
            ))}
          <Avatar
            label="+4"
            shape="circle"
            className="h-8 w-8 bg-blue-600 border text-white text-xs border-white"
          />
        </div>
      </div>

      <div className="flex rounded-md overflow-hidden border border-blue-600 dark:border-blue-400">
        <div className="bg-blue-600 text-white dark:bg-blue-500 px-4 py-1 text-sm font-medium grid place-items-center">
          Publish
        </div>
        <div className="bg-white dark:bg-neutral-800 grid place-items-center px-2">
          <Button
            icon={PrimeIcons.COG}
            onClick={() => {
              setShowEditModal(true);
              setPostId(post.pid);
            }}
            className="h-6 w-6"
          />
        </div>
      </div>
    </div>
  );
};

export default PostDraft;
