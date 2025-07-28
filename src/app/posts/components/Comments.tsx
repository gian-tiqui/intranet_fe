"use client";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import CommentSkeleton from "./CommentSkeleton";
import { MinMax, PostComment } from "@/app/types/types";
import useCommentIdRedirector from "@/app/store/commentRedirectionId";
import { Icon } from "@iconify/react";

interface Props {
  comments: PostComment[];
  postId: number;
}

const Comments: React.FC<Props> = ({ comments, postId }) => {
  const { cid } = useCommentIdRedirector();
  const [loading, setLoading] = useState<boolean>(true);
  const [minMax, setMinMax] = useState<MinMax>({
    min: 0,
    max: cid ? comments.length : 5,
  });

  useEffect(() => {
    setLoading(false);
  }, [comments]);

  if (loading) {
    return <CommentSkeleton />;
  }

  const remainingComments = comments.length - minMax.max;
  const hasMoreComments = remainingComments > 0;

  return (
    <div className="relative">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
            <Icon
              icon="material-symbols:chat-rounded"
              className="h-5 w-5 text-white"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Discussion
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-[#EEE] dark:bg-[#1f1f1f] px-4">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Container */}
      <div className="space-y-6 max-w-[80%] mx-auto">
        {comments.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center">
                <Icon
                  icon="material-symbols:chat-bubble-outline-rounded"
                  className="h-8 w-8 text-gray-400 dark:text-gray-500"
                />
              </div>
            </div>
            <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Be the first to share your thoughts on this post.
            </p>
          </div>
        ) : (
          <>
            {/* Comments List */}
            <div className="bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-neutral-700/50 shadow-lg overflow-hidden">
              <div className="divide-y divide-gray-200/50 dark:divide-neutral-700/50">
                {comments
                  .slice(minMax.min, minMax.max)
                  .map((comment, index) => (
                    <div
                      key={comment.cid}
                      className={`p-6 transition-all duration-200 hover:bg-white/80 dark:hover:bg-neutral-800/80 ${
                        index === 0 ? "rounded-t-2xl" : ""
                      } ${
                        index ===
                          comments.slice(minMax.min, minMax.max).length - 1 &&
                        !hasMoreComments
                          ? "rounded-b-2xl"
                          : ""
                      }`}
                    >
                      <Comment isReply comment={comment} postId={postId} />
                    </div>
                  ))}
              </div>

              {/* Show More Button */}
              {hasMoreComments && (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800/50 dark:to-neutral-700/50 border-t border-gray-200/50 dark:border-neutral-700/50">
                  <button
                    onClick={() =>
                      setMinMax({ min: minMax.min, max: minMax.max + 5 })
                    }
                    className="w-full group bg-white dark:bg-neutral-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/50 dark:hover:to-indigo-950/50 border border-gray-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-600 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <Icon
                          icon="material-symbols:expand-more-rounded"
                          className="h-4 w-4 text-white"
                        />
                      </div>
                      <div className="text-left">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Show {Math.min(5, remainingComments)} more comment
                          {Math.min(5, remainingComments) !== 1 ? "s" : ""}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {remainingComments} remaining
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Comments Stats */}
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 rounded-xl px-4 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Icon
                    icon="material-symbols:visibility-rounded"
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Showing {Math.min(minMax.max, comments.length)} of{" "}
                    {comments.length}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating scroll indicator (when there are many comments) */}
      {comments.length > 10 && (
        <div className="fixed bottom-32 right-6 z-30">
          <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border border-gray-200 dark:border-neutral-700 rounded-full px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs">
              <Icon
                icon="material-symbols:chat-rounded"
                className="h-3 w-3 text-blue-600 dark:text-blue-400"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {comments.length} comments
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
