import { useRouter } from "next/navigation";
import React from "react";
import { NotificationType } from "../types/types";

interface Props {
  notification: NotificationType;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/posts/${notification.postId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border w-full p-2 bg-white dark:border-black rounded-lg text-sm dark:bg-neutral-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800"
    >
      {notification.message}
    </div>
  );
};

export default Notification;
