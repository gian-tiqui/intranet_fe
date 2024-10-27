import { Post } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PostCellProps {
  post: Post;
  first?: boolean;
}

const PostCell: React.FC<PostCellProps> = ({ post, first }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showOpacity, setShowOpacity] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchImage = async () => {
      const accessToken = localStorage.getItem(INTRANET);
      if (accessToken && post?.imageLocation) {
        const imageUri = `${API_BASE}/uploads/${post.imageLocation}`;
        setImageUrl(imageUri);
      }
    };

    fetchImage();
  }, [post]);

  if (!post) {
    return (
      <div className="w-full h-full grid place-content-center">
        <p className="font-bold text-lg">No post to show</p>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setShowOpacity(true)}
      onMouseLeave={() => setShowOpacity(false)}
      className={`post-cell-container bg-gray-200 relative ${
        first ? "h-80" : "h-40"
      } ${imageUrl ? "bg-cover bg-top" : ""}`}
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
    >
      {showOpacity && (
        <div
          className="w-full h-full absolute bg-opacity-30 bg-black grid place-content-center"
          onClick={() => router.push(`/posts/${post.pid}`)}
        >
          <Icon icon={"hugeicons:view"} className="text-white h-7 w-7" />
        </div>
      )}
      {first && (
        <div className="absolute top-0 right-0 bg-red-500 px-3 py-2">
          <p className="font-bold">Latest</p>
        </div>
      )}
      <Image
        src={imageUrl}
        height={1000}
        width={1000}
        className="h-full w-full"
        alt={"title"}
      />
      <div
        className={`bg-opacity-75 px-4 flex items-center absolute bottom-5 left-0 bg-black w-2/3 ${
          first ? "h-20" : "h-10"
        }`}
      >
        <h2
          className={`${
            first ? "text-3xl font-extrabold" : "text-xs truncate font-bold"
          } text-white`}
        >
          {post?.title}
        </h2>
      </div>
    </div>
  );
};

export default PostCell;
