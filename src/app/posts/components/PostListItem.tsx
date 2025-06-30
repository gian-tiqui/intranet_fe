import { API_BASE } from "@/app/bindings/binding";
import { decodeUserData, fetchPostDeptIds } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import { Post } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface Props {
  post: Post;
}

const PostListItem: React.FC<Props> = ({ post }) => {
  const [showLight, setShowLight] = useState<boolean>(false);
  const [userDeptId, setUserDeptId] = useState<number | null>(null);
  const [deptIds, setDeptIds] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchReadStatus = async () => {
      if (!post.pid) return;

      try {
        const response = await apiClient.get(
          `${API_BASE}/monitoring/read-status?userId=${
            decodeUserData()?.sub
          }&postId=${post.pid}`
        );

        setShowLight(response.data.message !== "Read");
      } catch (error) {
        console.error(error);
      }
    };

    if (post.pid) fetchReadStatus();
  }, [post]);

  useEffect(() => {
    const populateDeptIds = async () => {
      if (!post?.pid) return;
      const deptIds = await fetchPostDeptIds(post?.pid);
      deptIds.push("4");
      const deptId = decodeUserData()?.deptId;

      if (deptId) setUserDeptId(deptId);
      setDeptIds(deptIds);
    };

    if (post?.pid) populateDeptIds();
  }, [post]);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between p-0">
        {/* Left content */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon container with gradient background */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/20 dark:to-purple-400/20 flex items-center justify-center backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/30">
              <Icon
                icon="solar:document-text-bold-duotone"
                className="h-4 w-4 text-blue-600 dark:text-blue-400 transition-colors duration-200"
              />
            </div>

            {/* Subtle glow effect on hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 0.3 : 0,
                scale: isHovered ? 1.2 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 blur-md -z-10"
            />
          </motion.div>

          {/* Title and metadata */}
          <div className="flex-1 min-w-0 space-y-1">
            <motion.h5
              initial={{ opacity: 0.8 }}
              animate={{ opacity: isHovered ? 1 : 0.8 }}
              className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate leading-tight"
            >
              {post.title
                ? post.title[0].toUpperCase() + post.title.substring(1)
                : "Untitled"}
            </motion.h5>

            {/* Subtle metadata */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Icon
                icon="solar:clock-circle-bold-duotone"
                className="h-3 w-3"
              />
              <span className="truncate">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Unknown time"}
              </span>
            </div>
          </div>
        </div>

        {/* Right side - notification indicator */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showLight && deptIds.includes(String(userDeptId)) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
                delay: 0.1,
              }}
              whileHover={{ scale: 1.2 }}
              className="relative"
            >
              {/* Main notification dot */}
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg shadow-blue-500/50">
                {/* Pulsing animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>

              {/* Tooltip on hover */}
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? -8 : 5,
                  scale: isHovered ? 1 : 0.9,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute -top-8 -right-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none z-10"
              >
                New post
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45 -mt-1" />
              </motion.div>
            </motion.div>
          )}

          {/* Subtle chevron indicator */}
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{
              opacity: isHovered ? 0.6 : 0,
              x: isHovered ? 0 : -5,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Icon
              icon="solar:chevron-right-bold"
              className="h-3 w-3 text-gray-400 dark:text-gray-500"
            />
          </motion.div>
        </div>
      </div>

      {/* Subtle hover underline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isHovered ? 1 : 0,
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent origin-center"
      />
    </div>
  );
};

export default PostListItem;
