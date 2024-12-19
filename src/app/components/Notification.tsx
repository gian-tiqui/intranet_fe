import { useRouter } from "next/navigation";
import React from "react";
import { NotificationType } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { Icon } from "@iconify/react/dist/iconify.js";
import useNotificationStore from "../store/selectedNotification";

interface Props {
  notification: NotificationType;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const router = useRouter();
  const { setNotification } = useNotificationStore();

  const handleClick = async () => {
    try {
      await apiClient.put(`${API_BASE}/notification/read/${notification.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      if (notification.postId && !notification.commentId) {
        console.log("this is a post");
        router.push(`/posts/${notification.postId}`);
      } else if (notification.comment?.parentComment) {
        console.log("this is a comment reply");
        setNotification(notification);
        router.push(`/posts/${notification.comment.parentComment.post.pid}`);
      } else {
        console.log("this is a post comment");
        router.push(`/posts/${notification.comment?.postId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`border w-full p-2  dark:border-black rounded-lg text-sm  cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 ${
        notification.isRead
          ? "bg-neutral-100 dark:bg-neutral-900"
          : "bg-white dark:bg-neutral-700"
      }`}
    >
      <Icon icon={`akar-icons:info`} className="h-5 w-5 mb-1" />
      <p>{notification.message}</p>
    </div>
  );
};

export default Notification;
