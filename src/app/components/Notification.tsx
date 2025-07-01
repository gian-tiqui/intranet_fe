import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NotificationType } from "../types/types";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import useCommentIdRedirector from "../store/commentRedirectionId";
import formatDate from "../utils/functions/formatDate"; // Assuming this exists
import useActivityBarStore from "../store/activitybar";
import { decodeUserData } from "../functions/functions";
import { motion } from "motion/react";

interface Props {
  notification: NotificationType;
}

const Notification: React.FC<Props> = ({ notification }) => {
  const router = useRouter();
  const { setCid } = useCommentIdRedirector();
  const { setShowActivityBar } = useActivityBarStore();
  const [avatarLabel, setAvatarLabel] = useState<string>("");

  useEffect(() => {
    const fn = decodeUserData()?.firstName;
    const ln = decodeUserData()?.lastName;

    if (!ln || !fn) return;

    const label = fn[0].toUpperCase() + ln[0].toUpperCase();

    setAvatarLabel(label);
  }, []);

  const handleClick = async () => {
    try {
      await apiClient.put(`${API_BASE}/notification/read/${notification.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      if (notification.comment?.parentComment?.cid) {
        setCid(notification.comment.parentComment.cid);
        router.push(`/posts/${notification.comment.parentComment.post.pid}`);
      } else if (!notification.comment?.parentId && notification.comment) {
        setCid(notification.comment.cid);
        router.push(`/posts/${notification.comment.post.pid}`);
      } else {
        router.push(`/posts/${notification.postId}`);
      }
      setShowActivityBar(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <div
        className="mx-4 mb-3 p-4 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-green-100/70 hover:border-green-200/80 transition-all duration-300 hover:shadow-lg cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex gap-4">
          {/* Modern Avatar with notification indicator */}
          <div className="relative flex-shrink-0">
            <Avatar
              className="h-11 w-11 bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-semibold ring-2 ring-green-100 shadow-sm"
              shape="circle"
              label={avatarLabel}
            />
            {/* Notification indicator - pulsing green dot */}
            <div className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 bg-red-400 border-2 border-white rounded-full animate-pulse"></div>
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-md text-xs mb-1">
                    <i className="pi pi-bell text-xs"></i>
                    Notification
                  </span>
                </p>
                <p className="text-sm text-gray-800 leading-relaxed mt-2">
                  {notification.message}
                </p>
              </div>

              {/* Modern action button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="h-8 w-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-700 transition-all duration-200 flex items-center justify-center group-hover:bg-green-150"
              >
                <i className={`${PrimeIcons.ARROW_UP_RIGHT} text-xs`} />
              </motion.button>
            </div>

            {/* Timestamp with modern styling */}
            {notification.createdAt && (
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-1 bg-green-400 rounded-full"></div>
                <time className="text-xs text-gray-500 font-medium">
                  {formatDate(notification.createdAt)}
                </time>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                  New
                </span>
              </div>
            )}

            {/* Subtle interaction indicator */}
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
              <span className="text-xs text-green-500 font-medium">
                Click to view
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-200 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;
