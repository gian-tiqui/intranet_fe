import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { GroupedPosts, Post } from "@/app/types/types";
import PostListSkeleton from "./PostListSkeleton";
import NoPosts from "./NoPosts";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicPosts } from "@/app/functions/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import PostListItem from "./PostListItem";
import { INTRANET } from "@/app/bindings/binding";
import Cookies from "js-cookie";
import { fetchDeptPostsByLid } from "@/app/utils/service/post";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  selectedVis: string;
  isMobile: boolean;
  onClick: (dest: string) => void;
}

const ModernSkeleton = () => {
  return (
    <div className="space-y-6 px-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            {/* Date header skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse" />
              <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg animate-pulse" />
            </div>

            {/* Post items skeleton */}
            <div className="ml-6 space-y-2">
              {Array(2)
                .fill(0)
                .map((_, postIndex) => (
                  <div
                    key={postIndex}
                    className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
                  >
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        ))}
    </div>
  );
};

const PostList: React.FC<Props> = ({ selectedVis, isMobile, onClick }) => {
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDeptPostsByLid();
  }, []);

  const { data: _posts, isLoading } = useQuery({
    queryKey: ["private_dept_posts_by_lid"],
    queryFn: fetchDeptPostsByLid,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(localStorage.getItem(INTRANET) && Cookies.get(INTRANET)),
  });

  const { data: _allPosts } = useQuery({
    queryKey: ["public_posts"],
    queryFn: fetchPublicPosts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: Boolean(localStorage.getItem(INTRANET) && Cookies.get(INTRANET)),
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (_posts) setPosts(_posts.posts);
  }, [_posts]);

  useEffect(() => {
    if (_allPosts) setAllPosts(_allPosts.posts);
  }, [_allPosts]);

  const { isCollapsed, setIsCollapsed } = useToggleStore();

  const groupedPosts = useMemo(() => {
    const postsToGroup = selectedVis === "dept" ? allPosts : posts;
    // Add defensive check - ensure we have a valid array
    if (!postsToGroup || !Array.isArray(postsToGroup)) {
      return {};
    }
    return groupPostsByDate(postsToGroup);
  }, [selectedVis, posts, allPosts]);

  // Also update the groupPostsByDate function to be more defensive
  const groupPostsByDate = (posts: Post[]) => {
    // Add safety check
    if (!posts || !Array.isArray(posts)) {
      return {};
    }

    return posts.reduce((groups: GroupedPosts, post: Post) => {
      // Add safety check for post object
      if (!post || !post.createdAt) {
        return groups;
      }

      const date = format(new Date(post.createdAt), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(post);
      return groups;
    }, {});
  };

  const [maxNum, setMaxNum] = useState<number>(2);

  const showMore = () => {
    setMaxNum((prevMax) => prevMax + 3);
  };

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  if (isLoading) {
    return <ModernSkeleton />;
  }

  if (!posts) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0 && allPosts?.length === 0) {
    return <NoPosts />;
  }

  const handleItemClicked = (pid: number) => {
    if (isMobile) setIsCollapsed(!isCollapsed);
    onClick(`/posts/${pid}`);
  };

  const sortedDates = Object.keys(groupedPosts).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Icon
              icon={
                selectedVis === "dept"
                  ? "solar:buildings-2-bold-duotone"
                  : "solar:global-bold-duotone"
              }
              className="h-4 w-4 text-blue-500"
            />
            Recent {selectedVis === "dept" ? "General" : "Department"} Posts
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {(selectedVis === "dept" ? allPosts : posts).length}
          </span>
        </div>
      </motion.div>

      {/* Posts Timeline */}
      <div className="relative px-4">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30" />

        <AnimatePresence>
          {sortedDates.slice(0, maxNum).map((date, dateIndex) => {
            const isExpanded = expandedDates.has(date);
            const postsForDate = groupedPosts[date];
            const displayPosts = isExpanded
              ? postsForDate
              : postsForDate.slice(0, 2);

            return (
              <motion.div
                key={date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: dateIndex * 0.1 }}
                className="relative mb-8 last:mb-4"
              >
                {/* Date header */}
                <div className="relative flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="relative z-10 w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30"
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse opacity-75" />
                  </motion.div>
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: dateIndex * 0.1 + 0.2 }}
                    className="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent"
                  >
                    {format(new Date(date), "MMMM dd, yyyy")}
                  </motion.h4>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-700" />
                </div>

                {/* Posts for this date */}
                <div className="ml-6 space-y-3">
                  <AnimatePresence>
                    {displayPosts.map((post, postIndex) => (
                      <motion.div
                        key={post.pid}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{
                          delay: dateIndex * 0.1 + postIndex * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        whileHover={{
                          scale: 1.02,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          },
                        }}
                        whileTap={{ scale: 0.98 }}
                        onMouseEnter={() => setHoveredPost(post.pid)}
                        onMouseLeave={() => setHoveredPost(null)}
                        onClick={() => handleItemClicked(post.pid)}
                        className="group relative cursor-pointer"
                      >
                        <div
                          className={`
                          relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ease-out
                          ${
                            hoveredPost === post.pid
                              ? "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 shadow-lg shadow-blue-500/10 transform translate-x-1"
                              : "bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800/90"
                          }
                        `}
                        >
                          {/* Hover indicator */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{
                              scaleX: hoveredPost === post.pid ? 1 : 0,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full origin-left"
                          />

                          <PostListItem post={post} />

                          {/* Hover arrow */}
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: hoveredPost === post.pid ? 1 : 0,
                              x: hoveredPost === post.pid ? 0 : -10,
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          >
                            <Icon
                              icon="solar:arrow-right-bold"
                              className="h-4 w-4 text-blue-500"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Show more posts for this date */}
                  {postsForDate.length > 2 && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: dateIndex * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleDateExpansion(date)}
                      className="w-full p-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg border border-blue-200/50 dark:border-blue-800/50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Icon
                        icon={
                          isExpanded
                            ? "solar:chevron-up-bold"
                            : "solar:chevron-down-bold"
                        }
                        className="h-4 w-4"
                      />
                      {isExpanded
                        ? "Show less"
                        : `Show ${postsForDate.length - 2} more post${
                            postsForDate.length - 2 > 1 ? "s" : ""
                          }`}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Load more dates */}
      {sortedDates.length > maxNum && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={showMore}
            className="w-full p-4 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Icon
              icon="solar:add-circle-bold-duotone"
              className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300"
            />
            Load More Posts
            <span className="text-xs opacity-75 ml-1">
              ({sortedDates.length - maxNum} more dates)
            </span>
          </motion.button>
        </motion.div>
      )}

      {/* Empty state indicator */}
      {sortedDates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-4 py-8 text-center"
        >
          <Icon
            icon="solar:inbox-empty-bold-duotone"
            className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No posts available
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PostList;
