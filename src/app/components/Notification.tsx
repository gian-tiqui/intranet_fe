import { useRouter } from "next/navigation";
import React from "react";
import { NotificationType } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";

interface Props {
  notification: NotificationType;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await apiClient.put(
        `${API_BASE}/notification/read/${notification.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      console.log(response);

      if (notification.postId) router.push(`/posts/${notification.postId}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`border w-full p-2  dark:border-black rounded-lg text-sm  cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 ${
        !notification.isRead
          ? "bg-gray-300 dark:bg-neutral-700"
          : "bg-white dark:bg-neutral-900"
      }`}
    >
      {notification.message}
    </div>
  );
};

export default Notification;
