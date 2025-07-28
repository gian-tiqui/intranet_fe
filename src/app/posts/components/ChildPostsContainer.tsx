import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Post } from "@/app/types/types";

interface ChildPostsContainerProps {
  childrenPosts: Post[];
  onViewPost?: (postId: number) => void;
}

const ChildPostsContainer: React.FC<ChildPostsContainerProps> = ({
  childrenPosts,
  onViewPost,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  if (!childrenPosts || childrenPosts.length === 0) {
    return null;
  }

  const handleViewPost = (post: Post) => {
    if (onViewPost) {
      onViewPost(post.pid);
    }
  };

  const handlePreviewPost = (post: Post) => {
    setSelectedPost(post);
    setShowPreviewModal(true);
  };

  return (
    <div className="relative max-w-[85%] mx-auto mt-8">
      {/* Main Container */}
      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-yellow-50/90 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-yellow-950/40 backdrop-blur-xl shadow-2xl border border-amber-200/60 dark:border-amber-800/40 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-yellow-400/20 backdrop-blur-sm"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    icon="material-symbols:history-rounded"
                    className="h-8 w-8 drop-shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black drop-shadow-lg">
                    Previous Versions
                  </h3>
                  <p className="text-amber-100 text-base font-medium drop-shadow">
                    {childrenPosts.length} older version
                    {childrenPosts.length !== 1 ? "s" : ""} available
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg">
                  <span className="text-lg font-black drop-shadow">
                    {childrenPosts.length}
                  </span>
                </div>
                <Icon
                  icon={
                    isExpanded
                      ? "material-symbols:expand-less-rounded"
                      : "material-symbols:expand-more-rounded"
                  }
                  className="h-8 w-8 group-hover:scale-110 transition-all duration-300 drop-shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div
          className={`transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="p-6 space-y-4">
            {childrenPosts.map((post, index) => (
              <div
                key={post.pid}
                className="group bg-white/80 dark:bg-neutral-800/80 rounded-2xl border border-amber-200/40 dark:border-amber-800/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-6 border-b border-amber-200/30 dark:border-amber-800/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-yellow-600 p-3 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon
                          icon="material-symbols:article-rounded"
                          className="h-6 w-6 text-white drop-shadow-sm"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                          <Icon
                            icon="material-symbols:schedule-rounded"
                            className="h-4 w-4"
                          />
                          <span className="font-medium">
                            Version {childrenPosts.length - index}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handlePreviewPost(post)}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        tooltip="Quick Preview"
                        tooltipOptions={{ position: "top" }}
                      >
                        <Icon
                          icon="material-symbols:visibility-rounded"
                          className="h-5 w-5"
                        />
                      </Button>

                      <Button
                        onClick={() => handleViewPost(post)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                        tooltip="View Full Post"
                        tooltipOptions={{ position: "top" }}
                      >
                        <Icon
                          icon="material-symbols:open-in-new-rounded"
                          className="h-5 w-5"
                        />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Post Preview */}
                <div className="p-6">
                  <div className="bg-gradient-to-r from-gray-50/60 to-amber-50/60 dark:from-neutral-900/60 dark:to-amber-950/60 rounded-2xl p-4 backdrop-blur-sm border border-gray-200/40 dark:border-neutral-700/40">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {post.message}
                    </p>
                    {post.message && post.message.length > 150 && (
                      <button
                        onClick={() => handlePreviewPost(post)}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium text-sm mt-2 flex items-center gap-1 transition-colors duration-200"
                      >
                        Read more
                        <Icon
                          icon="material-symbols:arrow-forward-ios-rounded"
                          className="h-3 w-3"
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Indicator */}
                <div className="h-1 bg-gradient-to-r from-amber-200 via-orange-300 to-yellow-200 dark:from-amber-800 dark:via-orange-800 dark:to-yellow-800"></div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/60 dark:to-orange-950/60 p-6 border-t border-amber-200/60 dark:border-amber-800/40 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-4 text-center">
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl shadow-lg">
                <Icon
                  icon="material-symbols:info-rounded"
                  className="h-5 w-5 text-white"
                />
              </div>
              <p className="text-amber-700 dark:text-amber-300 font-medium">
                These are previous versions of this post that have been
                superseded
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog
        visible={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        modal
        closable={true}
        showHeader={false}
        className="post-preview-modal"
        pt={{
          root: { className: "backdrop-blur-md rounded-3xl" },
          mask: { className: "bg-black/20 backdrop-blur-md" },
          content: {
            className:
              "!p-0 !border-0 !rounded-3xl !shadow-2xl !bg-transparent overflow-hidden max-w-[700px] w-full max-h-[80vh]",
          },
        }}
      >
        {selectedPost && (
          <div className="bg-gradient-to-br from-white/95 via-gray-50/95 to-amber-50/95 dark:from-neutral-900/95 dark:via-neutral-800/95 dark:to-amber-950/95 rounded-3xl border border-gray-200/60 dark:border-neutral-700/60 overflow-hidden backdrop-blur-xl shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-700 to-yellow-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-transparent to-yellow-400/20 backdrop-blur-sm"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                      <Icon
                        icon="material-symbols:article-rounded"
                        className="h-6 w-6 drop-shadow-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black drop-shadow-lg line-clamp-1">
                        {selectedPost.title}
                      </h3>
                      <p className="text-amber-100 text-sm font-medium drop-shadow">
                        Previous Version Preview
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Icon
                      icon="material-symbols:close-rounded"
                      className="h-6 w-6 drop-shadow-lg"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="bg-gradient-to-r from-gray-50/60 to-amber-50/60 dark:from-neutral-800/60 dark:to-amber-950/60 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/40 dark:border-neutral-700/40">
                <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed font-medium">
                  {selectedPost.message}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gradient-to-r from-gray-50/80 to-amber-50/80 dark:from-neutral-900/80 dark:to-amber-950/80 p-6 border-t border-gray-200/60 dark:border-neutral-700/60">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Post ID: {selectedPost.pid}
                </p>
                <Button
                  onClick={() => {
                    handleViewPost(selectedPost);
                    setShowPreviewModal(false);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Icon
                    icon="material-symbols:open-in-new-rounded"
                    className="h-5 w-5"
                  />
                  View Full Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f59e0b, #ea580c);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #d97706, #dc2626);
        }
      `}</style>
    </div>
  );
};

export default ChildPostsContainer;
