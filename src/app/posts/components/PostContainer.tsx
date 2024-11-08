"use client";
import usePost from "@/app/custom-hooks/post";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import PostSkeleton from "./PostSkeleton";
import Comments from "./Comments";
import { PostComment } from "@/app/types/types";
import CommentBar from "./CommentBar";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import DeleteModal from "./DeleteModal";
import { AnimatePresence } from "framer-motion";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import SmallToLarge from "@/app/components/animation/SmallToLarge";
import useEditModalStore from "@/app/store/editModal";
import usePostIdStore from "@/app/store/postId";
import { jsPDF } from "jspdf";
import apiClient from "@/app/http-common/apiUrl";
import { toast } from "react-toastify";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import useSetCommentsStore from "@/app/store/useCommentsStore";
import useReadStore from "@/app/store/readStore";
import useDeptIdStore from "@/app/store/deptIdStore";

interface Props {
  id: number;
  generalPost?: boolean;
}

const PostContainer: React.FC<Props> = ({ id, generalPost = false }) => {
  const router = useRouter();
  const post = usePost(id);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [comments, setComments] = useState<PostComment[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(true);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const { setShowEditModal } = useEditModalStore();
  const { setPostId } = usePostIdStore();
  const [message] = useState<string>("");
  const [extracting] = useState<boolean>(false);
  const { setSetComments, setThisComments } = useSetCommentsStore();
  const { isRead, setIsRead } = useReadStore();
  const { setDeptId } = useDeptIdStore();

  useEffect(() => {
    const fetchReadStatus = async () => {
      try {
        const response = await apiClient.get(
          `${API_BASE}/monitoring/read-status?userId=${
            decodeUserData()?.sub
          }&postId=${post?.pid}`
        );
        setIsRead(response.data.message === "Read");
      } catch (error) {
        console.log(error);
        setIsRead(false);
      }
    };

    if (post) {
      fetchReadStatus();
    }
  }, [post, setIsRead]);

  useEffect(() => {
    if (setComments) {
      setSetComments(setComments);
    }
  }, [setComments, setSetComments]);

  useEffect(() => {
    if (post) {
      setPostId(post?.pid);
    }
  }, [post, setPostId]);

  const handleReadClick = async () => {
    try {
      const response = await apiClient.post(`${API_BASE}/post-reader`, {
        userId: decodeUserData()?.sub,
        postId: id,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      if (response.status === 201) {
        setIsRead(true);
      }
    } catch (error) {
      console.error(error);
      toast("You have read the post already.", {
        type: "error",
        className: toastClass,
      });
    }
  };

  useEffect(() => {
    const handleClick = () => {
      if (showDeleteModal) {
        setShowDeleteModal(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showDeleteModal]);

  useEffect(() => {
    const handleClick = () => {
      if (!openOptions) {
        setOpenOptions(true);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [openOptions]);

  useEffect(() => {
    const userId = decodeUserData()?.sub;
    const deptCode = decodeUserData()?.departmentCode.toLowerCase();
    if (post) setDeptId(post?.deptId);

    if (userId === post?.userId || deptCode === "admin") {
      setEditable(true);
    }
  }, [post, setDeptId]);

  useEffect(() => {
    if (post) {
      setComments(post?.comments as PostComment[]);
      setThisComments(post?.comments as PostComment[]);
    }
  }, [post, setThisComments]);

  useEffect(() => {
    const fetchImage = async () => {
      const at = localStorage.getItem(INTRANET);

      if (at && post?.imageLocation)
        setImageUrl(`${API_BASE}/uploads/${post?.imageLocation}`);
    };

    fetchImage();
  }, [post]);

  const handleEditClicked = () => {
    const postId = post?.pid;

    if (postId) {
      setShowEditModal(true);
      setPostId(post?.pid);
    }
  };

  const handleDeleteClicked = () => {
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if (post) {
      if (!post.public && decodeUserData()?.deptId !== post.deptId) {
        toast(
          "You are trying to view a private post that is not for your department.",
          { type: "error", className: toastClass }
        );
        router.push("/bulletin");
      }
      setLoading(false);
    }
  }, [post, router]);

  const handleClick = () => {
    router.push(`/posts/${id}`);
  };

  const handleOptionsClicked = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleDownloadImage = async () => {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error("Failed to fetch image:", response.statusText);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const img = new window.Image();
      img.src = url;

      img.onload = () => {
        const pdf = new jsPDF();
        pdf.addImage(img, "JPEG", 10, 10, 180, 160);
        pdf.save(`post-image-${id}.pdf`);

        URL.revokeObjectURL(url);
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error in downloading image:", error);
    }
  };

  if (loading) {
    return <PostSkeleton />;
  }

  return (
    <>
      <AnimatePresence>
        {showDeleteModal && (
          <MotionTemplate>
            <DeleteModal
              setShowDeleteModal={setShowDeleteModal}
              postId={post?.pid}
            />
          </MotionTemplate>
        )}
      </AnimatePresence>

      <div
        onClick={generalPost ? handleClick : undefined}
        className={`ignore-click ${generalPost && "cursor-pointer"}`}
      >
        <div className="flex items-start gap-2 mb-4 justify-between">
          <div className="flex gap-3 items-start">
            <div className="h-9 w-9 bg-gray-300 rounded-full"></div>
            <h1 className="text-lg font-semibold">
              {decodeUserData()?.sub !== post?.userId
                ? `${post?.user?.firstName} ${post?.user?.lastName}`
                : "You"}{" "}
              <span className="text-sm font-medium">
                {post?.edited && "(Edited)"}
              </span>
            </h1>
          </div>
          {editable && (
            <div className="rounded">
              <div className="hover:bg-gray-300 hover:dark:bg-neutral-700 p-1 mb-1">
                <Icon
                  icon={"iwwa:option-horizontal"}
                  className="h-7 w-7"
                  onClick={() => setOpenOptions(!openOptions)}
                />
              </div>

              <AnimatePresence>
                {!openOptions && (
                  <SmallToLarge>
                    <div
                      className="absolute w-28 bg-neutral-200 border text-black dark:text-white border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-gray-700 p-2 right-0"
                      onClick={handleOptionsClicked}
                    >
                      <div
                        onClick={handleEditClicked}
                        className="w-full flex items-center gap-1 rounded-lg p-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-neutral-700"
                      >
                        <Icon icon={"lucide:edit"} className="h-5 w-5" />
                        <p className="text-sm">Edit</p>
                      </div>
                      <div
                        onClick={handleDeleteClicked}
                        className="w-full flex items-center gap-1 rounded-lg p-2 hover:bg-gray-300 cursor-pointer dark:hover:bg-neutral-700"
                      >
                        <Icon
                          icon={"material-symbols:delete-outline"}
                          className="h-5 w-5"
                        />
                        <p className="text-sm">Delete</p>
                      </div>
                    </div>
                  </SmallToLarge>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="w-full flex justify-between">
          <div>
            <h1 className="text-xl font-bold">{post?.title}</h1>
            <h4 className="text-xs mb-3">
              {post?.updatedAt
                ? format(new Date(post.createdAt), "MMMM dd, yyyy")
                : "Unknown Date"}
            </h4>
          </div>
          {/* {message === "" && (
            <button
              onClick={handleExtractImageClicked}
              className="hover:bg-gray-300 dark:hover:bg-neutral-700 flex items-center gap-1 px-2 text-sm rounded"
            >
              <Icon
                icon={`fluent:document-text-extract-20-regular`}
                className="h-5 w-5"
              />
              Extract text
            </button>
          )} */}
        </div>

        <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-2" />

        {extracting && <p>Extracting text</p>}

        {!extracting && (
          <div
            className="text-md mb-2 max-w-full whitespace-pre-wrap break-words"
            style={{
              overflowWrap: "break-word",
              wordWrap: "break-word",
              hyphens: "auto",
            }}
          >
            {message || post?.message}
          </div>
        )}
        {imageUrl && (
          <Image
            className="w-full bg-neutral-100 mb-6 h-full"
            src={imageUrl}
            alt="Post image"
            width={1000}
            height={1000}
            priority
          />
        )}
        <div
          className={`flex items-center w-full ${
            imageUrl ? "justify-between" : "justify-end"
          } gap-1 rounded-lg p-2 mb-2`}
        >
          {imageUrl && (
            <div
              onClick={handleDownloadImage}
              className="flex hover:bg-gray-300 dark:hover:bg-neutral-700 py-1 px-2 items-center gap-1 rounded  cursor-pointer "
            >
              <Icon icon={"akar-icons:download"} />
              <span className="text-sm">Download Image as PDF</span>
            </div>
          )}
          {decodeUserData()?.deptId === post?.deptId && (
            <div
              onClick={handleReadClick}
              className={`hover:bg-gray-300 dark:hover:bg-neutral-700 py-1 px-3 rounded flex items-center gap-1  cursor-pointer `}
            >
              {isRead === false && (
                <>
                  <Icon
                    icon={"material-symbols-light:mark-email-read-outline"}
                    className="h-6 w-6"
                  />
                  <p className="text-sm">Read</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <hr className="w-full border-t border-gray-300 dark:border-gray-700 mb-6" />
      {!generalPost && (
        <>
          {comments && <Comments comments={comments} postId={id} />}
          <CommentBar
            comments={comments}
            setComments={setComments}
            postId={id}
          />
        </>
      )}
    </>
  );
};

export default PostContainer;
