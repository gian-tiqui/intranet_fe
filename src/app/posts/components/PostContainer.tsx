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
          root: { className: "backdrop-blur-sm shadow-none rounded-2xl" },
          mask: { className: "bg-black/40 backdrop-blur-sm" },
          content: {
            className:
              "!p-0 !border-0 !rounded-2xl !shadow-2xl !bg-transparent overflow-hidden",
          },
        }}
      >
        <div className="relative bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/30 dark:via-neutral-900 dark:to-orange-950/30 p-8 rounded-2xl border border-red-200 dark:border-red-800/50 min-w-[400px] max-w-[500px]">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 dark:bg-red-900/20 rounded-full animate-pulse"></div>
            <div
              className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-100 dark:bg-orange-900/20 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
                <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full shadow-lg">
                  <Icon
                    icon="material-symbols:download-off-rounded"
                    className="h-8 w-8 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
              Document Not Downloadable
            </h2>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
              This document has been marked as{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                non-downloadable
              </span>{" "}
              by the author. You can view the content but cannot save it to your
              device.{" "}
              <span className="font-semibold text-red-600 dark:text-red-400">
                Do not take screenshots or photos
              </span>{" "}
              of this document as it may contain sensitive information.
            </p>

            {/* Visual indicator */}
            <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Icon
                  icon="material-symbols:shield-lock-rounded"
                  className="h-5 w-5 text-red-500 flex-shrink-0"
                />
                <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                  Download restrictions are in place for this document
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex justify-center">
              <button
                onClick={() => setDownloadableAlert(false)}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span>I Understand</span>
                <Icon
                  icon="material-symbols:check-circle-rounded"
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <Icon
              icon="material-symbols:warning-rounded"
              className="h-6 w-6 text-red-500"
            />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <Icon
              icon="material-symbols:security-rounded"
              className="h-6 w-6 text-red-500"
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
          root: { className: "backdrop-blur-sm rounded-2xl" },
          mask: { className: "bg-black/30 backdrop-blur-sm" },
          content: {
            className:
              "!p-0 !border-0 !rounded-2xl !shadow-2xl !bg-transparent overflow-hidden max-w-[700px] w-full",
          },
        }}
      >
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950/30 dark:via-neutral-900 dark:to-indigo-950/30 rounded-2xl border border-blue-200 dark:border-blue-800/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Icon
                      icon="material-symbols:groups-rounded"
                      className="h-6 w-6"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Readers by Department</h3>
                    <p className="text-blue-100 text-sm">
                      Who has read this post
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReadersModal(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <Icon
                    icon="material-symbols:close-rounded"
                    className="h-5 w-5"
                  />
                </button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="p-6">
            {(() => {
              if (!post?.readers || post.readers.length === 0) {
                return (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Icon
                        icon="material-symbols:person-off-rounded"
                        className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto"
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      No Readers Yet
                    </h4>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
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
                <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
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
                          className="bg-white/60 dark:bg-neutral-800/60 rounded-xl border border-gray-200/50 dark:border-neutral-700/50 overflow-hidden shadow-sm"
                        >
                          {/* Department Header */}
                          <div
                            onClick={() => toggleDepartment(deptCode)}
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/80 dark:hover:bg-neutral-800/80 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-md">
                                <Icon
                                  icon="material-symbols:corporate-fare-rounded"
                                  className="h-5 w-5 text-white"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {department.departmentName}
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {deptCode} • {department.readers.length}{" "}
                                  reader
                                  {department.readers.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">
                                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                  {department.readers.length}
                                </span>
                              </div>
                              <Icon
                                icon={
                                  expandedDepts.has(deptCode)
                                    ? "material-symbols:expand-less-rounded"
                                    : "material-symbols:expand-more-rounded"
                                }
                                className="h-6 w-6 text-gray-400 transition-transform duration-200"
                              />
                            </div>
                          </div>

                          {/* Department Users */}
                          {expandedDepts.has(deptCode) && (
                            <div className="bg-gray-50/50 dark:bg-neutral-900/50 border-t border-gray-200/50 dark:border-neutral-700/50">
                              <div className="p-4 space-y-3">
                                {department.readers
                                  .sort(
                                    (a: PostReader, b: PostReader) =>
                                      new Date(b.createdAt).getTime() -
                                      new Date(a.createdAt).getTime()
                                  )
                                  .map((reader: PostReader, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-4 p-3 bg-white/70 dark:bg-neutral-800/70 rounded-lg border border-gray-200/30 dark:border-neutral-700/30 hover:bg-white/90 dark:hover:bg-neutral-800/90 transition-all duration-200"
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
                                          className="font-bold bg-gradient-to-br from-green-500 to-teal-600 text-white h-10 w-10 shadow-md"
                                        />
                                      </div>

                                      {/* User Info */}
                                      <div className="flex-grow min-w-0">
                                        <h5 className="font-medium text-gray-900 dark:text-white truncate">
                                          {reader.user?.firstName}{" "}
                                          {reader.user?.lastName}
                                        </h5>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          Read{" "}
                                          {formatTimeAgo(
                                            String(reader.createdAt)
                                          )}
                                        </p>
                                      </div>

                                      {/* Time Badge */}
                                      <div className="flex-shrink-0">
                                        <div className="bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-md">
                                          <p className="text-xs font-medium text-green-700 dark:text-green-300">
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
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Icon
                      icon="material-symbols:visibility-rounded"
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {post.readers.length}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Total Readers
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Icon
                      icon="material-symbols:corporate-fare-rounded"
                      className="h-5 w-5 text-purple-600 dark:text-purple-400"
                    />
                    <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
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
                    <span className="text-xs text-purple-600 dark:text-purple-400">
                      Departments
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Icon
                      icon="material-symbols:trending-up-rounded"
                      className="h-5 w-5 text-green-600 dark:text-green-400"
                    />
                    <span className="text-lg font-bold text-green-700 dark:text-green-300">
                      {post?.census?.readPercentage || "0%"}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">
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
        } relative bg-[#EEE] dark:bg-[#1f1f1f] shadow-lg border border-gray-200 dark:border-neutral-700 rounded-xl p-6 my-6 transition-all duration-300 hover:shadow-xl max-w-[80%] mx-auto`}
      >
        {/* Watermark for non-downloadable documents */}
        {!post?.downloadable && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden rounded-xl">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform -rotate-45 text-red-500/20 dark:text-red-400/20 text-6xl font-bold whitespace-nowrap select-none">
                NOT DOWNLOADABLE
              </div>
            </div>
            <div className="absolute top-1/4 left-1/4 transform -rotate-45 text-red-500/15 dark:text-red-400/15 text-4xl font-bold whitespace-nowrap select-none">
              RESTRICTED DOCUMENT
            </div>
            <div className="absolute bottom-1/4 right-1/4 transform -rotate-45 text-red-500/15 dark:text-red-400/15 text-4xl font-bold whitespace-nowrap select-none">
              VIEW ONLY
            </div>
          </div>
        )}

        {deptIds.includes(userDeptId.toString()) &&
          !generalPost &&
          isRead === false && (
            <div
              onClick={handleReadClick}
              className={`hover:bg-gray-300 fixed z-10 bottom-64 bg-white rounded-full dark:bg-neutral-800 font-extrabold shadow-xl right-14 dark:hover:bg-neutral-700 py-2 px-3 flex items-center gap-1 cursor-pointer`}
            >
              <p className="text-sm">Read</p>
            </div>
          )}

        {/* Header */}
        <div className="flex items-start gap-2 mb-6 justify-between relative z-20">
          <div className="flex gap-3 items-start">
            {userData && (
              <Avatar
                label={
                  decodeUserData()?.sub === post?.userId
                    ? userData?.firstName[0] + userData?.lastName[0]
                    : `${post?.user?.firstName[0]}${post?.user?.lastName[0]}`
                }
                shape="circle"
                className="font-bold bg-blue-500 text-white h-10 w-10"
              />
            )}
            <div className="">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {decodeUserData()?.sub !== post?.userId
                  ? `${post?.user?.firstName} ${post?.user?.lastName}`
                  : "You"}{" "}
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {post?.edited && "(Edited)"}
                </span>
              </h1>
              <p className="text-sm flex gap-2 text-gray-500 dark:text-gray-400 italic">
                {post?.updatedAt
                  ? formatFullDateWithRelative(new Date(post.createdAt))
                  : "Unknown Date"}
              </p>
            </div>
          </div>

          {editable && (
            <div className="rounded">
              {!generalPost && (
                <div className="hover:bg-gray-300 hover:dark:bg-neutral-700 p-1 mb-1 rounded-full">
                  <Icon
                    icon={"iwwa:option-horizontal"}
                    className="h-7 w-7"
                    onClick={() => setOpenOptions(!openOptions)}
                  />
                </div>
              )}

              {!openOptions && (
                <>
                  <div
                    className="absolute z-50 w-28 bg-neutral-200 border text-black dark:text-white border-gray-300 rounded-xl dark:bg-neutral-800 dark:border-gray-700 p-2 right-0"
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
                </>
              )}
            </div>
          )}
        </div>

        {/* Title & Status */}
        <div className="w-full flex justify-between items-start mb-4 relative z-20">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-blue-800 dark:text-blue-300">
                {post?.title}
              </h1>
              {post?.superseeded && (
                <Button
                  pt={{
                    tooltip: {
                      text: { className: "text-xs" },
                      arrow: { className: "bg-blue-600" },
                    },
                  }}
                  onClick={() => router.push(`/posts/${post.parentId}`)}
                  icon={`${PrimeIcons.EXCLAMATION_CIRCLE}`}
                  tooltip={`This post has been superseeded by ${post.parentPost?.title}`}
                  className="p-button-sm"
                />
              )}
            </div>
          </div>

          {checkDept() && (
            <Button
              onClick={() => setShowReadersModal(true)}
              className="bg-[#EEE]/50 hover:bg-white/80 backdrop-blur px-4 py-1 shadow h-8 flex items-center rounded cursor-pointer mb-2"
            >
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {post?.census.readPercentage} have read this
              </p>
            </Button>
          )}
        </div>

        <hr className="my-4 border-t border-gray-300 dark:border-neutral-700 relative z-20" />

        {/* Post message */}
        <p className="text-base text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-line leading-relaxed relative z-20">
          {post?.message}
        </p>

        {/* Images */}
        {post?.imageLocations && post?.imageLocations?.length > 0 && (
          <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-xl mb-4 relative z-20">
            <ImagePaginator filePreviews={preview} currentPage={currentIndex} />
          </div>
        )}

        {/* Download button */}
        {post?.downloadable &&
          post?.imageLocations &&
          post?.imageLocations?.length > 0 &&
          !post.folderId && (
            <div className="flex justify-end mt-4 relative z-20">
              <div
                onClick={
                  post.imageLocations.length > 1
                    ? handleDownloadAllImages
                    : singleDownload
                }
                className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 px-3 py-2 rounded-md shadow cursor-pointer transition"
              >
                <Icon
                  icon={"akar-icons:download"}
                  className="text-blue-600 dark:text-blue-300"
                />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                  {post.imageLocations.length > 1
                    ? "Download all files"
                    : "Download file"}
                </span>
              </div>
            </div>
          )}
      </div>
      {/* Comments */}
      {!generalPost && (
        <>
          {comments && (
            <div className="p-4 mt-6">
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
        <div className="h-10 w-36 flex items-center justify-between bg-[#EEEEEE] dark:bg-neutral-800 fixed top-60 z-40 right-7 shadow rounded-lg">
          <Button
            className="h-8 w-8"
            onClick={() => {
              if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
            }}
            icon={`${PrimeIcons.ARROW_LEFT} text-xs`}
          />
          <p className="text-xs text-gray-700 dark:text-gray-300">
            Page {currentIndex + 1} of {preview.length}
          </p>
          <Button
            className="h-8 w-8"
            onClick={() => {
              if (currentIndex < preview.length - 1)
                setCurrentIndex((prev) => prev + 1);
            }}
            icon={`${PrimeIcons.ARROW_RIGHT} text-xs`}
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
            transform: translateY(0);
          }
          40% {
            transform: translateY(-5px);
          }
          60% {
            transform: translateY(-3px);
          }
        }

        .non-downloadable-dialog {
          animation: gentleBounce 0.6s ease-out;
        }

        @keyframes fadeInOut {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }

        .watermark-pulse {
          animation: fadeInOut 4s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default PostContainer;
