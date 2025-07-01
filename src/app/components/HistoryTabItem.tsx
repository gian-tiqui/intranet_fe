import React, { useEffect, useState } from "react";
import { Post } from "../types/types";
import { Avatar } from "primereact/avatar";
import formatDate from "../utils/functions/formatDate";
import { PrimeIcons } from "primereact/api";
import { useRouter } from "next/navigation";
import useActivityBarStore from "../store/activitybar";
import { decodeUserData } from "../functions/functions";
import { motion } from "motion/react";

interface Props {
  item: { createdAt: string; updatedAt: string; post: Post };
}

const HistoryTabItem: React.FC<Props> = ({ item }) => {
  const router = useRouter();
  const { setShowActivityBar } = useActivityBarStore();
  const [avatarLabel, setAvatarLabel] = useState<string>("");

  useEffect(() => {
    const fn = decodeUserData()?.firstName;
    const ln = decodeUserData()?.lastName;

    if (!ln || !fn) return;

    const label = fn[0].toUpperCase() + ln[0].toUpperCase();

    setAvatarLabel(label);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      className="group"
    >
      <div className="mx-4 mb-3 p-4 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-gray-100/50 hover:border-gray-200/60 transition-all duration-300 hover:shadow-lg">
        <div className="flex gap-4">
          {/* Modern Avatar with status indicator */}
          <div className="relative flex-shrink-0">
            <Avatar
              className="h-11 w-11 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold ring-2 ring-blue-100 shadow-sm"
              shape="circle"
              label={avatarLabel}
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-400 border-2 border-white rounded-full"></div>
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  You have read{" "}
                  <span className="font-semibold text-gray-900 bg-gray-100 px-1.5 py-0.5 rounded-md">
                    {item.post.title}
                  </span>
                </p>
              </div>

              {/* Modern action button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  router.push(`/posts/${item.post.pid}`);
                  setShowActivityBar(false);
                }}
                className="h-8 w-8 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 transition-all duration-200 flex items-center justify-center group-hover:bg-blue-50"
              >
                <i className={`${PrimeIcons.ARROW_UP_RIGHT} text-xs`} />
              </motion.button>
            </div>

            {/* Timestamp with modern styling */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
              <time className="text-xs text-gray-500 font-medium">
                {formatDate(item.createdAt)}
              </time>
            </div>

            {/* Post preview with better typography */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {item.post.message || (
                <span className="italic text-gray-400">
                  No description available
                </span>
              )}
            </p>

            {/* Subtle interaction indicator */}
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <span className="text-xs text-gray-400 font-medium">
                Click to view
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryTabItem;
