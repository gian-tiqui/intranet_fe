import React, { useEffect, useState } from "react";
import { Post } from "../types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { API_BASE } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";

interface Props {
  post: Post;
}

const FolderPost: React.FC<Props> = ({ post }) => {
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
        router.push(`/posts/${post.pid}`);
      }}
      key={post.pid}
      className="w-full h-52 bg-neutral-200 hover:bg-neutral-300 flex flex-col justify-between dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg hover:shadow p-4"
    >
      <p className="font-medium">{post.title}</p>
      <div className="w-full h-[70%] rounded bg-neutral-50 grid relative place-content-center dark:bg-neutral-900">
        {post.imageLocations && post.imageLocations.length > 0 ? (
          <Image
            src={`${API_BASE}/uploads/${post.imageLocations[0].imageLocation}`}
            alt={post.imageLocations[0].imageLocation}
            className="rounded"
            fill
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <i className={`${PrimeIcons.IMAGE} text-2xl`}></i>
            <p className="text-sm">No attachments</p>
          </div>
        )}
      </div>
    </div>
  ) : null;
};

export default FolderPost;
