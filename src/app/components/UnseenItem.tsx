import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { UnreadPost } from "../types/types";
import { useRouter } from "next/navigation";

interface Props {
  item: UnreadPost;
}

const UnseenItem: React.FC<Props> = ({ item }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${item.pid}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`border w-full p-2 bg-white dark:bg-neutral-900 dark:border-black rounded-lg text-sm  cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 `}
    >
      <Icon icon={`mdi:alert-outline`} className="h-5 w-5 mb-1" />
      <p>{item.title}</p>
      <p>{item.message}</p>
    </div>
  );
};

export default UnseenItem;
