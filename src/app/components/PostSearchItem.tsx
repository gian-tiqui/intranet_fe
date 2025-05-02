import React from "react";
import { Post } from "../types/types";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";

interface Props {
  post: Post;
  handleClose: () => void;
  type: string;
}

const PostSearchItem: React.FC<Props> = ({ post, handleClose, type }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${post.pid}`);
    handleClose();
  };

  return (
    <div
      onClick={handleClick}
      className="h-16 cursor-pointer w-[43%] flex items-center justify-between px-5 border border-black"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-full grid place-content-center">
          <i className={`${PrimeIcons.BOOK} text-xl text-white`}></i>
        </div>

        <p className="font-semibold">{post.title}</p>
      </div>
      <div>{type}</div>
    </div>
  );
};

export default PostSearchItem;
