import React, { useEffect, useState } from "react";
import { Post } from "../types/types";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { decodeUserData } from "../functions/functions";

interface Props {
  post: Post;
  setVisible: (visible: boolean) => void;
}

const FolderPost: React.FC<Props> = ({ post, setVisible }) => {
  const router = useRouter();
  const [canView, setCanView] = useState<boolean>(true);

  useEffect(() => {
    const checkLevel = async () => {
      const userData = await decodeUserData();

      if (!post?.lid || !post?.userId) {
        console.log("Post data not ready, skipping check...");
        return;
      }

      const canViewPost =
        (userData?.lid && post?.lid && userData?.lid > post?.lid) ||
        post?.userId === userData?.sub;

      if (!canViewPost) {
        setCanView(false);
      }
    };

    checkLevel();
  }, [post, router]);

  return canView ? (
    <div
      onClick={() => {
        setVisible(false);
        router.push(`/posts/${post.pid}`);
      }}
      key={post.pid}
      className="w-full h-36 bg-[#EEEEEE] flex flex-col justify-between rounded-xl shadow p-4 cursor-pointer"
    >
      <i className={`${PrimeIcons.FILE} text-lg`}></i>
      <p className="font-medium text-sm">{post.title}</p>
    </div>
  ) : null;
};

export default FolderPost;
