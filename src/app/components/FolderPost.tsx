import React, { useEffect, useState } from "react";
import { Post } from "../types/types";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { decodeUserData } from "../functions/functions";

interface Props {
  post: Post;
  setVisible: (visible: boolean) => void;
}

const FolderPost: React.FC<Props> = ({ post, setVisible }) => {
  const router = useRouter();
  const [canView, setCanView] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const checkLevel = async () => {
      const userData = decodeUserData();

      if (!post?.lid || !post?.userId) {
        console.debug("Post data not ready, skipping check...");
        return;
      }

      const canViewPost =
        (userData?.lid && post?.lid && userData?.lid > post?.lid) ||
        post?.userId === userData?.sub;

      if (!canViewPost) {
        setCanView(false);
      }
    };

    checkLevel();
  }, [post, router]);

  const handleClick = () => {
    setVisible(false);
    router.push(`/posts/${post.pid}`);
  };

  return canView ? (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full h-36 bg-gradient-to-br from-white via-gray-50 to-gray-100 
                 flex flex-col justify-between rounded-2xl shadow-md hover:shadow-2xl 
                 cursor-pointer border border-gray-200/50 backdrop-blur-sm
                 transform transition-all duration-300 ease-out
                 hover:scale-[1.02] hover:-translate-y-1
                 overflow-hidden"
      style={{
        background: isHovered
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
    >
      {/* Animated background overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      {/* Subtle animated dots pattern */}
      <div
        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Top section with icon */}
      <div className="relative z-10 p-4 pb-2">
        <div className="flex items-center justify-between">
          <div
            className={`p-3 rounded-xl transition-all duration-300 ${
              isHovered
                ? "bg-white/20 shadow-lg backdrop-blur-sm"
                : "bg-blue-50 shadow-sm"
            }`}
          >
            <i
              className={`${
                PrimeIcons.FILE
              } text-xl transition-colors duration-300 ${
                isHovered ? "text-white" : "text-blue-600"
              }`}
            ></i>
          </div>

          {/* Floating action indicator */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center
                          transition-all duration-300 ${
                            isHovered
                              ? "bg-white/20 scale-100 opacity-100"
                              : "bg-gray-200 scale-0 opacity-0"
                          }`}
          >
            <i className={`${PrimeIcons.ARROW_RIGHT} text-sm text-white`}></i>
          </div>
        </div>
      </div>

      {/* Bottom section with title */}
      <div className="relative z-10 p-4 pt-2">
        <div className="space-y-2">
          {/* Title with gradient text effect */}
          <h3
            className={`font-semibold text-sm leading-tight line-clamp-2 
                         transition-all duration-300 ${
                           isHovered
                             ? "text-white drop-shadow-sm"
                             : "text-gray-800"
                         }`}
          >
            {post.title}
          </h3>

          {/* Animated underline */}
          <div
            className={`h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 
                          transition-all duration-300 ${
                            isHovered ? "w-full opacity-100" : "w-0 opacity-0"
                          }`}
          />
        </div>
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                      transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.1)",
        }}
      />
    </div>
  ) : null;
};

export default FolderPost;
