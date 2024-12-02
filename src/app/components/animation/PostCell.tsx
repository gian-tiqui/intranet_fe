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
      if (accessToken && post?.imageLocations?.length) {
        const imageUri = `${API_BASE}/uploads/${post.imageLocations[0].imageLocation}`;
        if (imageUri) setImageUrl(imageUri);
      }
    };

    fetchImage();
  }, [post]);

  if (!post) {
    return (
      <div
        className={`${
          first ? "h-52 md:h-full" : "h-full"
        } w-full grid place-content-center`}
      >
        <div className="flex flex-col items-center gap-2">
          <Icon icon={"mdi:post-it-note-off-outline"} className="h-10 w-10" />

          <p className="font-semibold text-lg">No post to show</p>
        </div>
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
      {imageUrl ? (
        <Image
          src={imageUrl}
          height={1000}
          width={1000}
          className="h-full w-full"
          alt={"title"}
          priority
        />
      ) : (
        <div className="w-full h-full bg-gray-100 grid place-content-center">
          <Icon
            icon={"tabler:photo-x"}
            className={`${first ? "h-20 w-20" : "h-8 w-8"}`}
          />
        </div>
      )}
      <div
        className={`bg-opacity-75 w-full flex items-center absolute bottom-0 left-0 bg-black px-4 ${
          first ? "h-20" : "h-10"
        }`}
      >
        <h2
          className={`${
            first
              ? "text-lg md:text-xl lg:text-3xl font-extrabold"
              : "text-xs truncate font-bold"
          } text-white`}
        >
          {post?.title}
        </h2>
      </div>
    </div>
  );
};

export default PostCell;
