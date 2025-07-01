import React, { useEffect, useState } from "react";
import { UnreadPost } from "../types/types";
import { Avatar } from "primereact/avatar";
import formatDate from "../utils/functions/formatDate";
import { PrimeIcons } from "primereact/api";
import { useRouter } from "next/navigation";
import useActivityBarStore from "../store/activitybar";
import { decodeUserData } from "../functions/functions";
import { motion } from "motion/react";

interface Props {
  item: UnreadPost;
}

const UnreadItem: React.FC<Props> = ({ item }) => {
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
      <div className="mx-4 mb-3 p-4 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-orange-100/70 hover:border-orange-200/80 transition-all duration-300 hover:shadow-lg">
        <div className="flex gap-4">
          {/* Modern Avatar with unread indicator */}
          <div className="relative flex-shrink-0">
            <Avatar
              className="h-11 w-11 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold ring-2 ring-orange-100 shadow-sm"
              shape="circle"
              label={avatarLabel}
            />
            {/* Unread indicator - pulsing orange dot */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-orange-400 border-2 border-white rounded-full animate-pulse"></div>
          </div>

          {/* Content area */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  You haven&apos;t read{" "}
                  <span className="font-semibold text-gray-900 bg-orange-100 px-1.5 py-0.5 rounded-md">
                    {item.title}
                  </span>{" "}
                  yet
                </p>
              </div>

              {/* Modern action button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  router.push(`/posts/${item.pid}`);
                  setShowActivityBar(false);
                }}
                className="h-8 w-8 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-700 transition-all duration-200 flex items-center justify-center group-hover:bg-orange-150"
              >
                <i className={`${PrimeIcons.ARROW_UP_RIGHT} text-xs`} />
              </motion.button>
            </div>

            {/* Timestamp with modern styling */}
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-1 bg-orange-400 rounded-full"></div>
              <time className="text-xs text-gray-500 font-medium">
                {formatDate(item.createdAt)}
              </time>
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                Unread
              </span>
            </div>

            {/* Post preview with better typography */}
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
              {item.message || (
                <span className="italic text-gray-400">
                  No description available
                </span>
              )}
            </p>

            {/* Subtle interaction indicator */}
            <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              <span className="text-xs text-orange-500 font-medium">
                Click to read
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UnreadItem;
