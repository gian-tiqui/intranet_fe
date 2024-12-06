"use client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import PostSkeleton from "./PostSkeleton";
import Comments from "./Comments";
import { GroupedFiles, ImageLocation, PostComment } from "@/app/types/types";
import CommentBar from "./CommentBar";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import {
  decodeUserData,
  fetchPost,
  fetchPostDeptIds,
} from "@/app/functions/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence } from "framer-motion";
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
import { useQuery } from "@tanstack/react-query";
import useRefetchPostStore from "@/app/store/refetchPostStore";
import ImageSlider from "./ImageSlider";
import useImagesStore from "@/app/store/imagesStore";
import useDeleteModalStore from "@/app/store/deleteModalStore";
import useSignalStore from "@/app/store/signalStore";

interface Props {
  id: number;
  generalPost?: boolean;
  type: string;
}

const PostContainer: React.FC<Props> = ({ id, generalPost = false, type }) => {
  const router = useRouter();
  const { setRefetch } = useRefetchPostStore();

  const { data: post, refetch } = useQuery({
    queryKey: [`single-post-${id}-${type}`],
    queryFn: () => fetchPost(id),
  });
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(true);
  const { showDeleteModal, setShowDeleteModal } = useDeleteModalStore();
  const { setShowEditModal } = useEditModalStore();
  const { setPostId } = usePostIdStore();
  const [message] = useState<string>("");
  const [extracting] = useState<boolean>(false);
  const { setSetComments, setThisComments } = useSetCommentsStore();
  const { isRead, setIsRead } = useReadStore();
  const { setDeptId } = useDeptIdStore();
  const [deptIds, setDeptIds] = useState<string[]>([]);
  const [userDeptId, setUserDeptId] = useState<number>(-1);
  const { setImages } = useImagesStore();
  const { signal, setSignal } = useSignalStore();

  useEffect(() => {
    if (post && post.imageLocations) {
      const imageLocations = [
        ...post.imageLocations?.map(
          (imageLocation) => imageLocation.imageLocation
        ),
      ];

      if (imageLocations != undefined) {
        setImages(imageLocations);
      }
    }
  }, [post, setImages]);

  useEffect(() => {
    const handleRefetch = () => {
      refetch();
    };

    setRefetch(handleRefetch);
  }, [setRefetch, refetch]);

  useEffect(() => {
    const _deptId = decodeUserData()?.deptId;
    if (_deptId) setUserDeptId(_deptId);
  }, []);

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

  useEffect(() => {
    setIsRead(true);
    setSignal(false);
  }, [signal, setIsRead, setSignal]);

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
        setSignal(true);
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
  }, [showDeleteModal, setShowDeleteModal]);

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
    const populateDeptIds = async () => {
      if (!post?.pid) return;

      const userId = decodeUserData()?.sub;
      const deptCode = decodeUserData()?.departmentCode.toLowerCase();
      const deptId = decodeUserData()?.deptId;
      const deptIds = await fetchPostDeptIds(post.pid);

      if (post)
        setDeptId(Number(deptIds.find((did) => did === deptId?.toString())));

      if (userId === post?.userId || deptCode === "admin") {
        setEditable(true);
      }
    };

    populateDeptIds();
  }, [post, setDeptId]);

  const singleDownload = async () => {
    if (!post?.imageLocations) return;

    try {
      const imageLocation = post?.imageLocations[0];

      const response = await fetch(
        `${API_BASE}/uploads/${imageLocation.imageLocation}`
      );
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

        const imgWidth = 180;
        const imgHeight = (img.height * imgWidth) / img.width;

        pdf.addImage(img, "JPEG", 10, 10, imgWidth, imgHeight);
        pdf.save(`${imageLocation.imageLocation}.pdf`);

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

  useEffect(() => {
    if (post) {
      setComments(post?.comments as PostComment[]);
      setThisComments(post?.comments as PostComment[]);
    }
  }, [post, setThisComments]);

  const handleEditClicked = () => {
    const postId = post?.pid;

    if (postId) {
      setShowEditModal(true);
      setPostId(post?.pid);
    }
  };

  const handleDeleteClicked = () => {
    if (!post) return;

    setPostId(post?.pid);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    const populateDeptIds = async () => {
      if (!post?.pid) return;
      const deptIds = await fetchPostDeptIds(post?.pid);
      deptIds.push("4");
      const deptId = decodeUserData()?.deptId;
      const lid = decodeUserData()?.lid;
      const userId = decodeUserData()?.sub;

      setDeptIds(deptIds);

      if (userId && post && lid && deptId) {
        if (userId !== post.userId && lid < post.lid) {
          toast("You are unauthorized for this post.", {
            type: "error",
            className: toastClass,
          });
          router.push("/bulletin");

          return;
        }

        if (!post.public && !deptIds.includes(deptId.toString())) {
          toast(
            "You are trying to view a private post that is not for your department.",
            { type: "error", className: toastClass }
          );
          router.push("/bulletin");

          return;
        }
        setLoading(false);
      }
    };

    if (post?.pid) populateDeptIds();
  }, [post, router]);

  const handleClick = () => {
    router.push(`/posts/${id}`);
  };

  const handleOptionsClicked = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const groupFilesByTitle = (imageLocations: ImageLocation[]): GroupedFiles => {
    const groupedFiles: GroupedFiles = {};

    imageLocations.forEach((image) => {
      const fileName = image.imageLocation.split("/").pop() || "";

      const middlePart = fileName.match(/-\d+-(.*?) /)?.[1] || "Unknown";

      if (!groupedFiles[middlePart]) {
        groupedFiles[middlePart] = [];
      }
      groupedFiles[middlePart].push(image);
    });

    return groupedFiles;
  };

  const handleDownloadAllImages = async () => {
    if (!post?.imageLocations) return;

    try {
      const groupedFiles = groupFilesByTitle(post.imageLocations);

      for (const [title, images] of Object.entries(groupedFiles)) {
        const pdf = new jsPDF();

        const sortedImages = [...images].sort((a, b) => {
          const pageA = a.imageLocation.match(/-page(\d+)/)?.[1];
          const pageB = b.imageLocation.match(/-page(\d+)/)?.[1];
          return pageA && pageB ? parseInt(pageA, 10) - parseInt(pageB, 10) : 0;
        });

        for (const image of sortedImages) {
          const response = await fetch(
            `${API_BASE}/uploads/${image.imageLocation}`
          );
          if (!response.ok) {
            console.error(`Failed to fetch image: ${image.imageLocation}`);
            continue;
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          const img = new Image();
          img.src = url;

          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              const imgWidth = 180;
              const imgHeight = (img.height * imgWidth) / img.width;

              pdf.addImage(img, "JPEG", 10, 10, imgWidth, imgHeight);
              pdf.addPage();
              resolve();
            };

            img.onerror = (error) => {
              console.error(
                `Error loading image: ${image.imageLocation}`,
                error
              );
              reject(error);
            };
          });

          URL.revokeObjectURL(url);
        }

        pdf.deletePage(pdf.getNumberOfPages());
        pdf.save(`post-images-${title}.pdf`);
      }
    } catch (error) {
      console.error("Error in downloading images to PDF:", error);
    }
  };

  if (loading) {
    return <PostSkeleton />;
  }

  return (
    <>
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
              {!generalPost && (
                <div className="hover:bg-gray-300 hover:dark:bg-neutral-700 p-1 mb-1">
                  <Icon
                    icon={"iwwa:option-horizontal"}
                    className="h-7 w-7"
                    onClick={() => setOpenOptions(!openOptions)}
                  />
                </div>
              )}

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
        {post?.imageLocations && post?.imageLocations?.length > 0 && (
          <ImageSlider
            imageLocations={post.imageLocations}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        )}
        <div
          className={`flex items-center w-full ${
            post?.imageLocations && post?.imageLocations?.length > 0
              ? "justify-between"
              : "justify-end"
          } gap-1 rounded-lg pt-4 mb-2`}
        >
          {post?.imageLocations && post?.imageLocations?.length > 0 && (
            <div
              onClick={
                post.imageLocations.length > 1
                  ? handleDownloadAllImages
                  : singleDownload
              }
              className="flex hover:bg-gray-300 dark:hover:bg-neutral-700 py-1 px-2 items-center gap-1 rounded  cursor-pointer "
            >
              <Icon icon={"akar-icons:download"} />
              <span className="text-sm">
                {post.imageLocations.length > 1
                  ? "Download all files"
                  : "Download file"}
              </span>
            </div>
          )}
          {deptIds.includes(userDeptId.toString()) && !generalPost && (
            <div
              onClick={handleReadClick}
              className={`hover:bg-gray-300 dark:hover:bg-neutral-700 py-1 px-3 rounded flex items-center gap-1 cursor-pointer `}
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
