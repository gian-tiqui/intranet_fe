"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import PostSkeleton from "./PostSkeleton";
import Comments from "./Comments";
import {
  GroupedDepartment,
  GroupedFiles,
  GroupedReaders,
  ImageLocation,
  PostComment,
  PostReader,
} from "@/app/types/types";
import CommentBar from "./CommentBar";
import { API_BASE } from "@/app/bindings/binding";
import {
  checkDept,
  decodeUserData,
  fetchPost,
  fetchPostDeptIds,
} from "@/app/functions/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import useEditModalStore from "@/app/store/editModal";
import usePostIdStore from "@/app/store/postId";
import { jsPDF } from "jspdf";
import apiClient, { API_URI } from "@/app/http-common/apiUrl";
import { toast } from "react-toastify";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import useSetCommentsStore from "@/app/store/useCommentsStore";
import useReadStore from "@/app/store/readStore";
import useDeptIdStore from "@/app/store/deptIdStore";
import { useQuery } from "@tanstack/react-query";
import useRefetchPostStore from "@/app/store/refetchPostStore";
import useImagesStore from "@/app/store/imagesStore";
import useDeleteModalStore from "@/app/store/deleteModalStore";
import useSignalStore from "@/app/store/signalStore";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import ImagePaginator from "@/app/components/ImagePaginator";
import { Button } from "primereact/button";
import { PrimeIcons } from "primereact/api";
import { confirmDialog } from "primereact/confirmdialog";
import { formatFullDateWithRelative } from "@/app/utils/functions/formatFullDateWithRelative";
import { Dialog } from "primereact/dialog";
import formatTimeAgo from "@/app/utils/functions/formatTimeAgo";
import ChildPostsContainer from "./ChildPostsContainer";

interface Props {
  id: number;
  generalPost?: boolean;
  type: string;
}

const PostContainer: React.FC<Props> = ({ id, generalPost = false, type }) => {
  const router = useRouter();
  const { setRefetch } = useRefetchPostStore();

  const {
    data: post,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [`single-post-${id}-${type}`],
    queryFn: () => fetchPost(id),
  });
  const [showReadersModal, setShowReadersModal] = useState<boolean>(false);
  const [downloadableAlert, setDownloadableAlert] = useState<boolean>(false);
  const [preview, setPreviews] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(true);
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const { showDeleteModal, setShowDeleteModal } = useDeleteModalStore();
  const { setShowEditModal } = useEditModalStore();
  const { setPostId } = usePostIdStore();
  const { setSetComments, setThisComments } = useSetCommentsStore();
  const { isRead, setIsRead } = useReadStore();
  const { setDeptId } = useDeptIdStore();
  const [deptIds, setDeptIds] = useState<string[]>([]);
  const [userDeptId, setUserDeptId] = useState<number>(-1);
  const { setImages } = useImagesStore();
  const { signal, setSignal } = useSignalStore();
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    departmentName: string;
  } | null>(null);
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    const checkLevel = async () => {
      const userData = decodeUserData();

      if (!post?.lid || !post?.userId) {
        return;
      }

      const canViewPost =
        (userData?.lid && post?.lid && userData?.lid >= post?.lid) ||
        post?.userId === userData?.sub;

      if (!canViewPost) {
        router.push("/");
        toast("You are not allowed to view that post", {
          className: toastClass,
          type: "error",
        });
      }
    };

    checkLevel();
  }, [post, router]);

  useEffect(() => {
    const data = decodeUserData();
    if (data) {
      setUserData(data);
    }
  }, []);

  useEffect(() => {
    if (post && post.imageLocations) {
      const imageLocations = [
        ...post.imageLocations?.map(
          (imageLocation) => `${API_URI}/uploads/${imageLocation.imageLocation}`
        ),
      ];

      if (imageLocations != undefined) {
        setPreviews(imageLocations);
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
        console.error(error);
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

  const accept = async () => {
    try {
      const response = await apiClient.post(`${API_BASE}/post-reader`, {
        userId: decodeUserData()?.sub,
        postId: id,
        understood: 1,
      });
      if (response.status === 201) {
        setIsRead(true);
        setSignal(true);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast("You have read the post already.", {
        type: "error",
        className: toastClass,
      });
    }
  };

  const reject = async () => {
    try {
      const response = await apiClient.post(`${API_BASE}/post-reader`, {
        userId: decodeUserData()?.sub,
        postId: id,
        understood: 0,
      });
      if (response.status === 201) {
        setIsRead(true);
        setSignal(true);
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast("You have read the post already.", {
        type: "error",
        className: toastClass,
      });
    }
  };

  const handleReadClick = () => {
    confirmDialog({
      header: `Did you understand the ${post?.type.name.toLowerCase()}?`,
      content: `Please confirm that you have read and understood the ${post?.type.name.toLowerCase()}.`,
      accept,
      reject,
    });
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

  useEffect(() => {
    if (post) {
      setDownloadableAlert(!post.downloadable);
    }
  }, [post]);

  const handleDeleteClicked = (event: React.MouseEvent) => {
    if (!post) return;

    // Stop event propagation to prevent the document click listener from firing
    event?.stopPropagation();

    console.log("Delete clicked, post:", post?.pid);
    setPostId(post?.pid);

    // Use a small delay to avoid the document click listener
    setTimeout(() => {
      setShowDeleteModal(true);
      console.log("Modal should be visible now");
    }, 0);
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
      }
    };

    if (post?.pid) populateDeptIds();
  }, [post, router]);

  const handleClick = () => {
    router.push(`/posts/${id}`);
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
        pdf.save(`${title}.pdf`);
      }
    } catch (error) {
      console.error("Error in downloading images to PDF:", error);
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <>
      {checkDept() && post?.childrenPosts && post.childrenPosts.length > 0 && (
        <ChildPostsContainer
          childrenPosts={post.childrenPosts}
          onViewPost={(postId) => router.push(`/posts/${postId}`)}
        />
      )}
      <Dialog
        visible={downloadableAlert}
        onHide={() => {
          if (downloadableAlert) setDownloadableAlert((prev) => !prev);
        }}
        modal
        closable={false}
        showHeader={false}
        className="non-downloadable-dialog"
        pt={{
          root: { className: "backdrop-blur-sm shadow-none rounded-3xl" },
          mask: { className: "bg-black/20 backdrop-blur-md" },
          content: {
            className:
              "!p-0 !border-0 !rounded-3xl !shadow-2xl !bg-transparent overflow-hidden",
          },
        }}
      >
        <div className="relative bg-gradient-to-br from-red-50/95 via-white/95 to-rose-50/95 dark:from-red-950/40 dark:via-neutral-900/95 dark:to-rose-950/40 p-10 rounded-3xl border border-red-200/60 dark:border-red-800/40 min-w-[450px] max-w-[550px] backdrop-blur-xl">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-red-200/30 to-rose-300/30 dark:from-red-900/20 dark:to-rose-900/20 rounded-full animate-pulse blur-xl"></div>
            <div
              className="absolute -bottom-12 -left-12 w-28 h-28 bg-gradient-to-br from-rose-200/30 to-pink-300/30 dark:from-rose-900/20 dark:to-pink-900/20 rounded-full animate-pulse blur-xl"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl animate-ping opacity-20"></div>
                <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-rose-600 p-5 rounded-2xl shadow-2xl">
                  <Icon
                    icon="material-symbols:download-off-rounded"
                    className="h-10 w-10 text-white drop-shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent text-center mb-4">
              Document Not Downloadable
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8 leading-relaxed text-lg">
              This document has been marked as{" "}
              <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-1 rounded-lg">
                non-downloadable
              </span>{" "}
              by the author. You can view the content but cannot save it to your
              device.{" "}
              <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-1 rounded-lg">
                Do not take screenshots or photos
              </span>{" "}
              of this document as it may contain sensitive information.
            </p>

            {/* Visual indicator */}
            <div className="bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-950/60 dark:to-rose-950/60 border border-red-200/60 dark:border-red-800/40 rounded-2xl p-5 mb-8 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-red-500 to-rose-600 p-3 rounded-xl shadow-lg flex-shrink-0">
                  <Icon
                    icon="material-symbols:shield-lock-rounded"
                    className="h-6 w-6 text-white"
                  />
                </div>
                <div>
                  <span className="text-red-700 dark:text-red-300 font-bold text-lg">
                    Download Restrictions Active
                  </span>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    This document is protected by security policies
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-center">
              <button
                onClick={() => setDownloadableAlert(false)}
                className="group relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <span className="relative z-10 text-lg">I Understand</span>
                <Icon
                  icon="material-symbols:check-circle-rounded"
                  className="h-6 w-6 group-hover:scale-110 transition-transform relative z-10"
                />
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-6 right-6 opacity-10">
            <Icon
              icon="material-symbols:warning-rounded"
              className="h-8 w-8 text-red-500"
            />
          </div>
          <div className="absolute bottom-6 left-6 opacity-10">
            <Icon
              icon="material-symbols:security-rounded"
              className="h-8 w-8 text-red-500"
            />
          </div>
        </div>
      </Dialog>

      {/* Readers Modal */}
      <Dialog
        visible={showReadersModal}
        onHide={() => setShowReadersModal(false)}
        modal
        closable={true}
        showHeader={false}
        className="readers-modal"
        pt={{
          root: { className: "backdrop-blur-md rounded-3xl" },
          mask: { className: "bg-black/20 backdrop-blur-md" },
          content: {
            className:
              "!p-0 !border-0 !rounded-3xl !shadow-2xl !bg-transparent overflow-hidden max-w-[750px] w-full",
          },
        }}
      >
        <div className="bg-gradient-to-br from-blue-50/95 via-white/95 to-indigo-50/95 dark:from-blue-950/40 dark:via-neutral-900/95 dark:to-indigo-950/40 rounded-3xl border border-blue-200/60 dark:border-blue-800/40 overflow-hidden backdrop-blur-xl shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-indigo-400/20 backdrop-blur-sm"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                    <Icon
                      icon="material-symbols:groups-rounded"
                      className="h-8 w-8 drop-shadow-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black drop-shadow-lg">
                      Readers by Department
                    </h3>
                    <p className="text-blue-100 text-base font-medium drop-shadow">
                      Who has read this post
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReadersModal(false)}
                  className="hover:bg-white/20 p-3 rounded-2xl transition-all duration-200 hover:scale-110"
                >
                  <Icon
                    icon="material-symbols:close-rounded"
                    className="h-6 w-6 drop-shadow-lg"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {(() => {
              if (!post?.readers || post.readers.length === 0) {
                return (
                  <div className="text-center py-16">
                    <div className="mb-6">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-3xl flex items-center justify-center shadow-xl">
                        <Icon
                          icon="material-symbols:person-off-rounded"
                          className="h-12 w-12 text-gray-400 dark:text-gray-500"
                        />
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-3">
                      No Readers Yet
                    </h4>
                    <p className="text-gray-500 dark:text-gray-500 text-lg">
                      This post hasn&apos;t been read by anyone yet.
                    </p>
                  </div>
                );
              }

              // Group readers by department
              const groupedReaders: GroupedReaders = post.readers.reduce(
                (acc: GroupedReaders, reader: PostReader) => {
                  const deptCode =
                    reader.user?.department?.departmentCode || "Unknown";
                  const deptName =
                    reader.user?.department?.departmentName ||
                    "Unknown Department";

                  if (!acc[deptCode]) {
                    acc[deptCode] = {
                      departmentName: deptName,
                      departmentCode: deptCode,
                      readers: [],
                    };
                  }

                  acc[deptCode].readers.push(reader);
                  return acc;
                },
                {}
              );

              const toggleDepartment = (deptCode: string) => {
                const newExpanded = new Set(expandedDepts);
                if (newExpanded.has(deptCode)) {
                  newExpanded.delete(deptCode);
                } else {
                  newExpanded.add(deptCode);
                }
                setExpandedDepts(newExpanded);
              };

              return (
                <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {Object.entries(groupedReaders)
                    .sort(
                      ([, a], [, b]) =>
                        (b as GroupedDepartment).readers.length -
                        (a as GroupedDepartment).readers.length
                    )
                    .map(
                      ([deptCode, department]: [string, GroupedDepartment]) => (
                        <div
                          key={deptCode}
                          className="bg-white/80 dark:bg-neutral-800/80 rounded-2xl border border-gray-200/60 dark:border-neutral-700/60 overflow-hidden shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
                        >
                          {/* Department Header */}
                          <div
                            onClick={() => toggleDepartment(deptCode)}
                            className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/90 dark:hover:bg-neutral-800/90 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 p-3 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                                <Icon
                                  icon="material-symbols:corporate-fare-rounded"
                                  className="h-7 w-7 text-white drop-shadow-lg"
                                />
                              </div>
                              <div>
                                <h4 className="font-black text-xl text-gray-900 dark:text-white">
                                  {department.departmentName}
                                </h4>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                  {deptCode} • {department.readers.length}{" "}
                                  reader
                                  {department.readers.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 px-4 py-2 rounded-2xl shadow-lg">
                                <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                                  {department.readers.length}
                                </span>
                              </div>
                              <Icon
                                icon={
                                  expandedDepts.has(deptCode)
                                    ? "material-symbols:expand-less-rounded"
                                    : "material-symbols:expand-more-rounded"
                                }
                                className="h-8 w-8 text-gray-400 transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                          </div>

                          {/* Department Users */}
                          {expandedDepts.has(deptCode) && (
                            <div className="bg-gradient-to-r from-gray-50/60 to-blue-50/60 dark:from-neutral-900/60 dark:to-blue-950/60 border-t border-gray-200/60 dark:border-neutral-700/60 backdrop-blur-sm">
                              <div className="p-6 space-y-4">
                                {department.readers
                                  .sort(
                                    (a: PostReader, b: PostReader) =>
                                      new Date(b.createdAt).getTime() -
                                      new Date(a.createdAt).getTime()
                                  )
                                  .map((reader: PostReader, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-5 p-5 bg-white/90 dark:bg-neutral-800/90 rounded-2xl border border-gray-200/40 dark:border-neutral-700/40 hover:bg-white dark:hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm"
                                    >
                                      {/* Avatar */}
                                      <div className="flex-shrink-0">
                                        <Avatar
                                          label={`${
                                            reader.user?.firstName?.[0] || "?"
                                          }${
                                            reader.user?.lastName?.[0] || "?"
                                          }`}
                                          shape="circle"
                                          className="font-black bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white h-14 w-14 shadow-xl text-lg"
                                        />
                                      </div>

                                      {/* User Info */}
                                      <div className="flex-grow min-w-0">
                                        <h5 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                                          {reader.user?.firstName}{" "}
                                          {reader.user?.lastName}
                                        </h5>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                                          Read{" "}
                                          {formatTimeAgo(
                                            String(reader.createdAt)
                                          )}
                                        </p>
                                      </div>

                                      {/* Time Badge */}
                                      <div className="flex-shrink-0">
                                        <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 px-4 py-2 rounded-2xl shadow-lg">
                                          <p className="text-sm font-bold text-green-700 dark:text-green-300">
                                            {new Date(
                                              reader.createdAt
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    )}
                </div>
              );
            })()}

            {/* Footer Stats */}
            {post?.readers && post.readers.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-purple-950/60 rounded-2xl border border-blue-200/60 dark:border-blue-800/40 shadow-xl backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-2xl shadow-lg">
                      <Icon
                        icon="material-symbols:visibility-rounded"
                        className="h-7 w-7 text-white"
                      />
                    </div>
                    <span className="text-2xl font-black text-blue-700 dark:text-blue-300">
                      {post.readers.length}
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">
                      Total Readers
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 rounded-2xl shadow-lg">
                      <Icon
                        icon="material-symbols:corporate-fare-rounded"
                        className="h-7 w-7 text-white"
                      />
                    </div>
                    <span className="text-2xl font-black text-purple-700 dark:text-purple-300">
                      {
                        Object.keys(
                          post.readers.reduce(
                            (
                              acc: Record<string, boolean>,
                              reader: PostReader
                            ) => {
                              const deptCode =
                                reader.user?.department?.departmentCode ||
                                "Unknown";
                              acc[deptCode] = true;
                              return acc;
                            },
                            {} as Record<string, boolean>
                          )
                        ).length
                      }
                    </span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      Departments
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-br from-green-500 to-green-700 p-3 rounded-2xl shadow-lg">
                      <Icon
                        icon="material-symbols:trending-up-rounded"
                        className="h-7 w-7 text-white"
                      />
                    </div>
                    <span className="text-2xl font-black text-green-700 dark:text-green-300">
                      {post?.census?.readPercentage || "0%"}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      Read Rate
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog>

      <Toast ref={toastRef} />

      <div
        onClick={generalPost ? handleClick : undefined}
        className={`ignore-click ${
          generalPost && "cursor-pointer"
        } relative bg-gradient-to-br from-white/90 via-gray-50/90 to-blue-50/90 dark:from-neutral-900/90 dark:via-neutral-800/90 dark:to-blue-950/90 backdrop-blur-xl shadow-2xl border border-gray-200/60 dark:border-neutral-700/60 rounded-3xl p-8 my-8 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] max-w-[85%] mx-auto overflow-hidden`}
      >
        {/* Watermark for non-downloadable documents */}
        {!post?.downloadable && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-3xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform -rotate-45 text-red-500/15 dark:text-red-400/15 text-8xl font-black whitespace-nowrap select-none watermark-pulse">
                NOT DOWNLOADABLE
              </div>
            </div>
            <div className="absolute top-1/4 left-1/4 transform -rotate-45 text-red-500/10 dark:text-red-400/10 text-5xl font-black whitespace-nowrap select-none watermark-pulse">
              RESTRICTED DOCUMENT
            </div>
            <div className="absolute bottom-1/4 right-1/4 transform -rotate-45 text-red-500/10 dark:text-red-400/10 text-5xl font-black whitespace-nowrap select-none watermark-pulse">
              VIEW ONLY
            </div>
          </div>
        )}

        {/* Floating Read Button */}
        {deptIds.includes(userDeptId.toString()) &&
          !generalPost &&
          isRead === false && (
            <div
              onClick={handleReadClick}
              className={`hover:bg-white/90 dark:hover:bg-neutral-700/90 fixed z-10 bottom-72 bg-gradient-to-r from-white/80 to-gray-100/80 dark:from-neutral-800/80 dark:to-neutral-700/80 rounded-2xl font-black shadow-2xl right-16 py-3 px-5 flex items-center gap-2 cursor-pointer backdrop-blur-xl border border-gray-200/60 dark:border-neutral-600/60 hover:scale-110 transition-all duration-300`}
            >
              <Icon
                icon="material-symbols:visibility-rounded"
                className="h-5 w-5"
              />
              <p className="font-bold">Mark as Read</p>
            </div>
          )}

        {/* Header */}
        <div className="flex items-start gap-4 mb-8 justify-between relative z-20">
          <div className="flex gap-4 items-start">
            {userData && (
              <div className="relative">
                <Avatar
                  label={
                    decodeUserData()?.sub === post?.userId
                      ? userData?.firstName[0] + userData?.lastName[0]
                      : `${post?.user?.firstName[0]}${post?.user?.lastName[0]}`
                  }
                  shape="circle"
                  className="font-black bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white h-14 w-14 shadow-xl text-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white dark:border-neutral-800 shadow-lg"></div>
              </div>
            )}
            <div className="">
              <h1 className="text-xl font-black text-gray-900 dark:text-white">
                {decodeUserData()?.sub !== post?.userId
                  ? `${post?.user?.firstName} ${post?.user?.lastName}`
                  : "You"}{" "}
                <span className="text-base font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-lg">
                  {post?.edited && "(Edited)"}
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                <Icon
                  icon="material-symbols:schedule-rounded"
                  className="h-4 w-4"
                />
                {post?.updatedAt
                  ? formatFullDateWithRelative(new Date(post.createdAt))
                  : "Unknown Date"}
              </p>
            </div>
          </div>

          {editable && (
            <div className="rounded-2xl">
              {editable && !generalPost && (
                <div className="hover:bg-gray-200/80 dark:hover:bg-neutral-700/80 p-2 mb-2 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110">
                  <Icon
                    icon="iwwa:option-horizontal"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => setShowOptionsDialog(true)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <Dialog
          visible={showOptionsDialog}
          onHide={() => setShowOptionsDialog(false)}
          modal
          closable={true}
          showHeader={false}
          className="options-dialog"
          pt={{
            root: { className: "backdrop-blur-md rounded-3xl" },
            mask: { className: "bg-black/20 backdrop-blur-md" },
            content: {
              className:
                "!p-0 !border-0 !rounded-3xl !shadow-2xl !bg-transparent overflow-hidden max-w-[280px] w-full",
            },
          }}
        >
          <div className="bg-gradient-to-br from-white/95 via-gray-50/95 to-blue-50/95 dark:from-neutral-900/95 dark:via-neutral-800/95 dark:to-blue-950/95 rounded-3xl border border-gray-200/60 dark:border-neutral-700/60 overflow-hidden backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-indigo-400/20 backdrop-blur-sm"></div>
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                      <Icon
                        icon="material-symbols:settings-rounded"
                        className="h-6 w-6 drop-shadow-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-black drop-shadow-lg">
                        Post Options
                      </h3>
                      <p className="text-blue-100 text-sm font-medium drop-shadow">
                        Manage your post
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOptionsDialog(false)}
                    className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:scale-110"
                  >
                    <Icon
                      icon="material-symbols:close-rounded"
                      className="h-5 w-5 drop-shadow-lg"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              {/* Edit Option */}
              <div
                onClick={() => {
                  handleEditClicked();
                  setShowOptionsDialog(false);
                }}
                className="group flex items-center gap-4 p-4 bg-white/80 dark:bg-neutral-800/80 rounded-2xl border border-gray-200/40 dark:border-neutral-700/40 hover:bg-blue-50/90 dark:hover:bg-blue-950/60 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    icon="lucide:edit"
                    className="h-6 w-6 text-white drop-shadow-sm"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                    Edit Post
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Modify content and settings
                  </p>
                </div>
                <Icon
                  icon="material-symbols:arrow-forward-ios-rounded"
                  className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                />
              </div>

              {/* Delete Option */}
              <div
                onClick={(e) => {
                  handleDeleteClicked(e);
                  setShowOptionsDialog(false);
                }}
                className="group flex items-center gap-4 p-4 bg-white/80 dark:bg-neutral-800/80 rounded-2xl border border-gray-200/40 dark:border-neutral-700/40 hover:bg-red-50/90 dark:hover:bg-red-950/60 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <div className="bg-gradient-to-br from-red-500 to-red-700 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    icon="material-symbols:delete-outline"
                    className="h-6 w-6 text-white drop-shadow-sm"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-lg text-red-600 dark:text-red-400">
                    Delete Post
                  </h4>
                  <p className="text-red-500 dark:text-red-400 text-sm">
                    Permanently remove this post
                  </p>
                </div>
                <Icon
                  icon="material-symbols:arrow-forward-ios-rounded"
                  className="h-4 w-4 text-red-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-neutral-900/80 dark:to-blue-950/80 p-4 border-t border-gray-200/60 dark:border-neutral-700/60">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
                Changes will take effect immediately
              </p>
            </div>
          </div>
        </Dialog>

        {/* Title & Status */}
        <div className="w-full flex justify-between items-start mb-6 relative z-20">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-800 dark:from-blue-300 dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
                {post?.title}
              </h1>
              {post?.superseeded && (
                <Button
                  pt={{
                    tooltip: {
                      text: { className: "text-sm font-medium" },
                      arrow: { className: "bg-blue-600" },
                    },
                  }}
                  onClick={() => router.push(`/posts/${post.parentId}`)}
                  icon={`${PrimeIcons.EXCLAMATION_CIRCLE}`}
                  tooltip={`This post has been superseeded by ${post.parentPost?.title}`}
                  className="p-button-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                />
              )}
            </div>
          </div>

          {checkDept() && (
            <Button
              onClick={() => setShowReadersModal(true)}
              className="bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-neutral-800/80 dark:to-blue-950/80 hover:from-white/90 hover:to-blue-100/90 dark:hover:from-neutral-700/90 dark:hover:to-blue-900/90 backdrop-blur-xl px-6 py-3 shadow-xl h-auto flex items-center rounded-2xl cursor-pointer mb-3 border border-blue-200/60 dark:border-blue-800/60 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon="material-symbols:groups-rounded"
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                />
                <p className="font-bold text-gray-700 dark:text-gray-300">
                  {post?.census.readPercentage} have read this
                </p>
              </div>
            </Button>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 via-transparent to-indigo-200/30 dark:from-blue-800/20 dark:via-transparent dark:to-indigo-800/20 rounded-2xl blur-xl"></div>
          <hr className="relative my-6 border-t-2 border-gradient-to-r from-gray-300 via-blue-300 to-gray-300 dark:from-neutral-700 dark:via-blue-700 dark:to-neutral-700 z-20" />
        </div>

        {/* Post message */}
        <div className="relative z-20 mb-6">
          <div className="bg-gradient-to-r from-gray-50/60 to-blue-50/60 dark:from-neutral-800/60 dark:to-blue-950/60 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/40 dark:border-neutral-700/40">
            <p className="text-lg text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed font-medium">
              {post?.message}
            </p>
          </div>
        </div>

        {/* Images */}
        {post?.imageLocations && post?.imageLocations?.length > 0 && (
          <div className="bg-gradient-to-br from-gray-100/80 to-blue-100/80 dark:from-neutral-800/80 dark:to-blue-950/80 p-6 rounded-2xl mb-6 relative z-20 backdrop-blur-sm border border-gray-200/60 dark:border-neutral-700/60 shadow-xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl blur-xl"></div>
              <div className="relative">
                <ImagePaginator
                  filePreviews={preview}
                  currentPage={currentIndex}
                />
              </div>
            </div>
          </div>
        )}

        {/* Download button */}
        {post?.downloadable &&
          post?.imageLocations &&
          post?.imageLocations?.length > 0 &&
          !post.folderId && (
            <div className="flex justify-end mt-6 relative z-20">
              <div
                onClick={
                  post.imageLocations.length > 1
                    ? handleDownloadAllImages
                    : singleDownload
                }
                className="group flex items-center gap-3 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/80 dark:to-indigo-900/80 hover:from-blue-200/90 hover:to-indigo-200/90 dark:hover:from-blue-800/90 dark:hover:to-indigo-800/90 px-6 py-4 rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-blue-200/60 dark:border-blue-800/60"
              >
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Icon
                    icon={"akar-icons:download"}
                    className="h-6 w-6 text-white"
                  />
                </div>
                <div>
                  <span className="font-bold text-blue-700 dark:text-blue-200 text-lg">
                    {post.imageLocations.length > 1
                      ? "Download all files"
                      : "Download file"}
                  </span>
                  <p className="text-blue-600 dark:text-blue-300 text-sm">
                    {post.imageLocations.length} file
                    {post.imageLocations.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          )}
      </div>

      {/* Comments */}
      {!generalPost && (
        <>
          {comments && (
            <div className="p-6 mt-8 bg-gradient-to-br from-white/60 via-gray-50/60 to-blue-50/60 dark:from-neutral-900/60 dark:via-neutral-800/60 dark:to-blue-950/60 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-neutral-700/60 shadow-2xl max-w-[85%] mx-auto">
              <Comments comments={comments} postId={id} />
              <CommentBar
                comments={comments}
                setComments={setComments}
                postId={id}
              />
            </div>
          )}
        </>
      )}

      {/* Floating paginator */}
      {preview.length > 0 && (
        <div className="h-14 w-44 flex items-center justify-between bg-gradient-to-r from-white/90 to-gray-100/90 dark:from-neutral-800/90 dark:to-neutral-700/90 backdrop-blur-xl fixed top-64 z-40 right-8 shadow-2xl rounded-2xl border border-gray-200/60 dark:border-neutral-700/60 p-2">
          <Button
            className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg hover:scale-110 transition-all duration-300"
            onClick={() => {
              if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
            }}
            icon={`${PrimeIcons.ARROW_LEFT} text-white`}
          />
          <div className="text-center">
            <p className="font-bold text-gray-700 dark:text-gray-300">
              Page {currentIndex + 1}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              of {preview.length}
            </p>
          </div>
          <Button
            className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl shadow-lg hover:scale-110 transition-all duration-300"
            onClick={() => {
              if (currentIndex < preview.length - 1)
                setCurrentIndex((prev) => prev + 1);
            }}
            icon={`${PrimeIcons.ARROW_RIGHT} text-white`}
          />
        </div>
      )}

      {/* CSS for watermark animations */}
      <style jsx>{`
        .non-downloadable-dialog .p-dialog-content {
          background: transparent !important;
        }

        @keyframes gentleBounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0) scale(1);
          }
          40% {
            transform: translateY(-8px) scale(1.02);
          }
          60% {
            transform: translateY(-4px) scale(1.01);
          }
        }

        .non-downloadable-dialog {
          animation: gentleBounce 0.8s ease-out;
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.15;
          }
        }

        .watermark-pulse {
          animation: fadeInOut 6s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
      `}</style>
    </>
  );
};

export default PostContainer;
