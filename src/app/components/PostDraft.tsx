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
    <div className="w-full bg-[#EEEEEE] h-20 rounded-lg cursor-pointer flex justify-between shadow items-center px-6">
      <div className="flex items-center gap-3">
        <Image
          src={bluePost.src}
          alt="drafts-folder-icon"
          className="h-7 w-7"
        />
        <p className="font-medium text-blue-600 text-lg">{post.title}</p>
      </div>
      <div>
        <p className="text-xs">Created at</p>
        <p className="text-sm text-blue-600 font-medium">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div>
        <p className="text-xs mb-1">Shared to</p>
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
      <div className="h-8 rounded w-32 flex">
        <div className="bg-blue-600 grid place-content-center text-white text-sm rounded-s-lg w-24 h-8">
          Publish
        </div>
        <div className="w-10 bg-white rounded-e-lg h-8 grid place-content-center">
          <Button
            icon={`${PrimeIcons.COG}`}
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
