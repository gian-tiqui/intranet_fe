"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useDepartments from "@/app/custom-hooks/departments";
import {
  decodeUserData,
  fetchAllLevels,
  getFolderById,
} from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import useShowPostStore from "@/app/store/showPostStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { pdfjs } from "react-pdf";
import { Folder, Level, PostType, Query } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import { createWorker } from "tesseract.js";
import DepartmentsList from "./DepartmentsList";
import { jwtDecode } from "jwt-decode";
import useSignalStore from "@/app/store/signalStore";
import { Checkbox } from "primereact/checkbox";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { getFolders } from "@/app/utils/service/folderService";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { PrimeIcons } from "primereact/api";
import { Toast } from "primereact/toast";
import useToastRefStore from "@/app/store/toastRef";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import ImagePaginator from "@/app/components/ImagePaginator";
import { getPostTypes } from "@/app/utils/service/postTypeService";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface FormFields {
  userId: number;
  deptIds: string;
  message?: string;
  memo?: FileList;
  title?: string;
  public: string;
  lid: number;
  extractedText: string;
  postId?: number;
  downloadable: string;
  isPublished: number;
}

const DepartmentsListMemo = React.memo(DepartmentsList);
const MAX_DEPTH = 10;

interface Props {
  isMobile: boolean;
}

const PostModal: React.FC<Props> = ({ isMobile }) => {
  const [publish, setPublish] = useState<boolean>(false);
  const [notify, setNotify] = useState<boolean>(false);
  const [downloadable, setDownloadable] = useState<boolean>(false);
  const { setVisible } = useShowPostStore();
  const { setToastRef } = useToastRefStore();
  const { setIsCollapsed } = useToggleStore();
  const departments = useDepartments();
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [postType, setPostType] = useState<PostType | undefined>();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(
    undefined
  );
  const toastRef = useRef<Toast>(null);
  const [foldersQuery] = useState<Query>({
    includeSubfolders: 0,
    search: "",
    skip: 0,
    take: 500,
    depth: MAX_DEPTH,
    isPublished: 1,
  });

  useEffect(() => {
    if (publish) setValue("isPublished", 1);
    else setValue("isPublished", 0);
  }, [publish, setValue]);

  useEffect(() => {
    setToastRef(toastRef);
  }, [toastRef, setToastRef]);

  const [postVisibility, setPostVisibility] = useState<string>("public");
  const { setSignal } = useSignalStore();
  const { data, isError, error } = useQuery({
    queryKey: ["level"],
    queryFn: fetchAllLevels,
  });

  const { data: postTypesResponse } = useQuery({
    queryKey: [`post-types`],
    queryFn: () => getPostTypes(),
  });

  const options: { value: string; icon: string }[] = [
    {
      value: "public",
      icon: "pi pi-globe",
    },
    { value: "private", icon: "pi pi-lock" },
  ];
  const { data: foldersData } = useQuery({
    queryKey: [`folders-${JSON.stringify(foldersQuery)}`],
    queryFn: () => getFolders(foldersQuery),
  });

  useEffect(() => {
    if (postVisibility) setValue("public", postVisibility);
  }, [postVisibility, setValue]);

  useEffect(() => {
    setValue("deptIds", selectedDepartments.join(","));
  }, [selectedDepartments, setValue]);

  useEffect(() => {
    if (selectedLevel) setValue("lid", selectedLevel?.lid);
  }, [selectedLevel, setValue]);

  const scanImage = async (imageUrl: string): Promise<string> => {
    const worker = await createWorker("eng");
    try {
      const {
        data: { text },
      } = await worker.recognize(imageUrl);
      return text.toLowerCase();
    } catch (error) {
      console.error("Error scanning image:", error);
      return "";
    } finally {
      await worker.terminate();
    }
  };

  useEffect(() => {
    if (data) setLevels(data);
  }, [data]);

  if (isError) console.error(error);

  const convertPdfToImage = async (pdfFile: File) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const pageCount = pdf._pdfInfo.numPages;
    const convertedFiles = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob!);
          },
          "image/jpeg",
          0.95
        );
      });

      convertedFiles.push(
        new File(
          [blob],
          pdfFile.name.replace(".pdf", `-page${pageNumber}.jpg`),
          {
            type: "image/jpeg",
          }
        )
      );
    }

    return convertedFiles;
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        const fileNames: string[] = [];
        const previews: string[] = [];
        let extractedTexts = "";
        const convertedFiles: File[] = [];

        setIsConverting(true);
        try {
          for (const file of files) {
            if (file.type === "application/pdf") {
              toastRef.current?.show({
                detail: `Converting PDF: ${file.name}`,
                severity: "info",
              });

              const convertedImages = await convertPdfToImage(file);

              const texts = await Promise.all(
                convertedImages.map(async (convertedImage) => {
                  const text = await scanImage(
                    URL.createObjectURL(convertedImage)
                  );
                  previews.push(URL.createObjectURL(convertedImage));
                  convertedFiles.push(convertedImage);
                  return text;
                })
              );

              extractedTexts += texts.join(" ") + " ";
            } else if (file.type.startsWith("image/")) {
              const text = await scanImage(URL.createObjectURL(file));
              extractedTexts += text + " ";
              convertedFiles.push(file);
              previews.push(URL.createObjectURL(file));
            } else {
              toastRef.current?.show({
                content: `Unsupported file format: ${file.name}`,
                severity: "info",
              });
            }

            fileNames.push(file.name);
          }

          setFileNames(fileNames);
          setConvertedFiles(convertedFiles);
          setFilePreviews(previews);
          setValue("extractedText", extractedTexts.trim());

          toastRef.current?.show({
            summary: "Files processed successfully!",
            severity: "info",
          });
        } catch (error) {
          console.error("Error processing files:", error);

          toastRef.current?.show({
            summary: "An error occurred while processing files.",
            severity: "info",
          });
        } finally {
          setIsConverting(false);
        }
      }
    },
    [setValue]
  );

  const handlePost = async (data: FormFields) => {
    if (!postVisibility || postVisibility == "") {
      toastRef.current?.show({
        summary: "Select post visibility.",
        severity: "info",
      });
      return;
    }

    if (!data.lid) {
      toastRef.current?.show({
        summary: "Select an employee level.",
        severity: "info",
      });
      return;
    }

    if (selectedDepartments.length == 0) {
      toastRef.current?.show({
        summary: "Select at least one department.",
        severity: "info",
      });
      return;
    }

    if (!data.title && !data.message && convertedFiles.length == 0) {
      toastRef.current?.show({
        summary: "Upload a document or write a title or description.",
        severity: "info",
      });
      return;
    }

    if (convertedFiles.length >= 25) {
      toastRef.current?.show({
        summary: "You have exceeded the file limit.",
        severity: "info",
      });
      return;
    }
    if (isConverting) {
      toastRef.current?.show({
        summary: "Processing. Please wait.",
        severity: "info",
      });
      return;
    }

    const at = localStorage.getItem(INTRANET);

    if (at) {
      setPosting(true);
      const decode: { sub: number } = jwtDecode(at);
      data.userId = decode.sub;

      const formData = new FormData();
      formData.append("userId", String(data.userId));
      formData.append("deptIds", String(data.deptIds));
      formData.append("public", data.public);
      formData.append("lid", String(data.lid));
      formData.append("extractedText", data.extractedText);
      formData.append("downloadable", data.downloadable);
      formData.append("isPublished", data.isPublished.toString());
      formData.append("typeId", postType ? postType.id.toString() : "1");

      if (selectedFolder)
        formData.append("folderId", String(selectedFolder.id));
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);

      convertedFiles.sort((a, b) => {
        const getPage = (name: string) => {
          const match = name.match(/-page(\d+)\.jpg/);
          return match ? parseInt(match[1], 10) : 0;
        };

        return getPage(a.name) - getPage(b.name);
      });

      const extractBatchAndPage = (fileName: string) => {
        const match = fileName.match(/^(.*)-page(\d+)\.jpg$/);
        if (match) {
          return { batch: match[1], page: parseInt(match[2], 10) };
        }
        return { batch: fileName, page: 0 };
      };

      const groups: { key: string; files: File[] }[] = [];
      const batchMap = new Map<string, File[]>();

      convertedFiles.forEach((file) => {
        const { batch } = extractBatchAndPage(file.name);
        if (!batchMap.has(batch)) {
          batchMap.set(batch, []);
          groups.push({ key: batch, files: batchMap.get(batch)! });
        }
        batchMap.get(batch)!.push(file);
      });

      groups.forEach((group) => {
        group.files.sort((a, b) => {
          const { page: pageA } = extractBatchAndPage(a.name);
          const { page: pageB } = extractBatchAndPage(b.name);
          return pageA - pageB;
        });
      });

      const sortedConvertedFiles = groups.flatMap((group) => group.files);

      sortedConvertedFiles.forEach((file) => {
        formData.append("memo", file);
      });

      try {
        const response = await apiClient.post(`${API_BASE}/post`, formData);

        if (response.status === 201) {
          setVisible(false);

          if (notify) {
            const notifications = data.deptIds.split(",").map((deptId) =>
              apiClient
                .post(`${API_BASE}/notification/new-post`, null, {
                  params: {
                    deptId: deptId,
                    postId: response.data.post.pid,
                    lid: data.lid,
                  },
                })
                .catch((error) => {
                  console.error("Failed to send notification:", error);
                })
            );

            Promise.all(notifications)
              .then(async () => {
                toastRef.current?.show({
                  summary: "Notified the departments.",
                  severity: "info",
                });

                const userLid: number | undefined = decodeUserData()?.lid;

                if (
                  userLid &&
                  response.data.post.lid <= userLid &&
                  data.deptIds.split(",").includes(String(userLid)) &&
                  !selectedFolder
                ) {
                  await apiClient.post(`${API_BASE}/post-reader`, {
                    userId: decodeUserData()?.sub,
                    postId: response.data.post.pid,
                    understood: 1,
                  });
                }
              })
              .then(() => setSignal(true))
              .catch(() => {
                console.error("Some notifications failed.");
              })
              .finally(() => {
                setPosting(false);
                setSignal(false);
              });
          } else {
            setSignal(true);
          }
        }
      } catch (error) {
        console.error(error);
        toastRef.current?.show({
          summary: "Error creating post.",
          severity: "info",
        });
      } finally {
        setPosting(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      filePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [filePreviews]);

  useEffect(() => {
    setValue("downloadable", downloadable ? "1" : "0");
  }, [setValue, downloadable]);

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [setIsCollapsed, isMobile]);

  useEffect(() => {
    const uploadArea = document.querySelector(".file-upload-area");
    const dragOverlay = document.querySelector(".drag-overlay");

    if (!uploadArea || !dragOverlay) return;

    let dragCounter = 0;

    const handleDragEnter = (e: Event) => {
      const event = e as DragEvent;
      event.preventDefault();
      event.stopPropagation();
      dragCounter++;

      // Check if dragged items contain files
      if (event.dataTransfer?.types.includes("Files")) {
        dragOverlay.classList.add("opacity-100");
        dragOverlay.classList.remove("opacity-0");
        uploadArea.classList.add("border-blue-400", "bg-blue-50/40");
        uploadArea.classList.remove("border-slate-300");
      }
    };

    const handleDragOver = (e: Event) => {
      const event = e as DragEvent;
      event.preventDefault();
      event.stopPropagation();
    };

    const handleDragLeave = (e: Event) => {
      const event = e as DragEvent;
      event.preventDefault();
      event.stopPropagation();
      dragCounter--;

      if (dragCounter === 0) {
        dragOverlay.classList.add("opacity-0");
        dragOverlay.classList.remove("opacity-100");
        uploadArea.classList.remove("border-blue-400", "bg-blue-50/40");
        uploadArea.classList.add("border-slate-300");
      }
    };

    const handleDrop = async (e: Event) => {
      const event = e as DragEvent;
      event.preventDefault();
      event.stopPropagation();
      dragCounter = 0;

      // Hide drag overlay
      dragOverlay.classList.add("opacity-0");
      dragOverlay.classList.remove("opacity-100");
      uploadArea.classList.remove("border-blue-400", "bg-blue-50/40");
      uploadArea.classList.add("border-slate-300");

      if (!event.dataTransfer?.files || isConverting) return;

      const droppedFiles = Array.from(event.dataTransfer.files);
      const validFiles = droppedFiles.filter((file) => {
        const validTypes = [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
        ];
        return validTypes.includes(file.type);
      });

      if (validFiles.length === 0) {
        toastRef.current?.show({
          summary: "Invalid file type",
          detail: "Please upload PDF or image files only.",
          severity: "warn",
        });
        return;
      }

      if (validFiles.length + fileNames.length > 25) {
        toastRef.current?.show({
          summary: "File limit exceeded",
          detail: `You can only upload ${25 - fileNames.length} more files.`,
          severity: "warn",
        });
        return;
      }

      // Create a synthetic event object for handleFileChange
      const syntheticEvent = {
        target: {
          files: validFiles,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      // Show success message for valid drops
      toastRef.current?.show({
        summary: "Files added",
        detail: `${validFiles.length} file${
          validFiles.length > 1 ? "s" : ""
        } ready for processing.`,
        severity: "success",
      });

      // Call the existing file handler
      await handleFileChange(syntheticEvent);
    };

    // Add event listeners
    uploadArea.addEventListener("dragenter", handleDragEnter as EventListener);
    uploadArea.addEventListener("dragover", handleDragOver as EventListener);
    uploadArea.addEventListener("dragleave", handleDragLeave as EventListener);
    uploadArea.addEventListener("drop", handleDrop as EventListener);

    // Cleanup function
    return () => {
      uploadArea.removeEventListener("dragenter", handleDragEnter);
      uploadArea.removeEventListener("dragover", handleDragOver);
      uploadArea.removeEventListener("dragleave", handleDragLeave);
      uploadArea.removeEventListener("drop", handleDrop);
    };
  }, [isConverting, fileNames.length, handleFileChange]); // Dependencies for the useEffect

  // Additional helper function to clear all files (optional)
  const clearAllFiles = () => {
    setFileNames([]);
    setConvertedFiles([]);
    setFilePreviews([]);
    setCurrentPage(0);
    setValue("extractedText", "");

    // Reset file input
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    toastRef.current?.show({
      summary: "Files cleared",
      detail: "All uploaded files have been removed.",
      severity: "info",
    });
  };

  const selectedOptionTemplate = (
    option: { level: string } | null,
    props: DropdownProps
  ) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div>{option.level}</div>
        </div>
      );
    }

    return <span>{props.placeholder || "Select a level"}</span>;
  };

  const buildTree = (folders: Folder[]): object[] => {
    return folders.map((folder) => ({
      key: folder.id.toString(),
      label: folder.name,
      icon: PrimeIcons.FOLDER,
      value: folder.id.toString(),
      children: folder.subfolders ? buildTree(folder.subfolders) : undefined,
    }));
  };

  const levelOptionTemplate = (option: { level: string }) => {
    return (
      <div className="flex align-items-center">
        <div>{option.level}</div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(handlePost)}
      onClick={handleFormClick}
      className="h-screen w-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 z-50 absolute"
    >
      <div className="flex h-full">
        {/* Main Content Area */}
        <div className="w-[70%] flex justify-center h-full overflow-y-auto relative">
          {/* File Preview Navigation */}
          {filePreviews.length > 0 && (
            <div className="fixed bottom-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 h-14 px-4 items-center w-48 z-50 right-[450px] flex justify-between">
              <Button
                type="button"
                className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 justify-center text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
                onClick={() => {
                  if (currentPage > 0) setCurrentPage((prev) => prev - 1);
                }}
                icon={`${PrimeIcons.ARROW_LEFT}`}
              />
              <p className="text-sm font-semibold text-slate-700">
                Page {currentPage + 1}
              </p>
              <Button
                type="button"
                className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 justify-center text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
                onClick={() => {
                  if (currentPage < filePreviews.length - 1)
                    setCurrentPage((prev) => prev + 1);
                }}
                icon={`${PrimeIcons.ARROW_RIGHT}`}
              />
            </div>
          )}

          {/* Main Writing Area */}
          <div className="w-[70%] pt-8 px-6">
            {/* User Info Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar
                    className="bg-gradient-to-br from-blue-500 to-purple-600 h-14 w-14 font-bold text-white shadow-lg ring-4 ring-white/50"
                    shape="circle"
                    label={
                      String(decodeUserData()?.firstName[0]).toUpperCase() +
                      String(decodeUserData()?.lastName[0]).toUpperCase()
                    }
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">
                    {decodeUserData()?.firstName} {decodeUserData()?.lastName}
                  </h3>
                  <div className="bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 text-sm items-center flex gap-2 mt-2 border border-white/40">
                    <MultiStateCheckbox
                      value={postVisibility}
                      options={options}
                      onChange={(e) => setPostVisibility(e.value)}
                      optionValue="value"
                    />
                    <span className="font-medium text-slate-700">
                      {postVisibility || "Select visibility"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-8">
              <div className="space-y-6">
                {/* Title Input */}
                <div className="relative">
                  <input
                    className="w-full outline-none p-4 bg-white/50 backdrop-blur-sm rounded-2xl placeholder-slate-500 text-xl font-semibold border border-white/40 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Write your title here..."
                    {...register("title")}
                  />
                </div>

                {/* Date Display */}
                <div className="flex items-center gap-2 px-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm font-medium text-slate-600">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="relative">
                  <textarea
                    className="w-full outline-none p-4 bg-white/50 backdrop-blur-sm rounded-2xl placeholder-slate-500 resize-none overflow-hidden min-h-[120px] border border-white/40 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    placeholder="Share your thoughts..."
                    {...register("message")}
                    onInput={(e) => {
                      e.currentTarget.style.height = "auto";
                      e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                  />
                </div>

                {/* File Upload Area */}
                <div className="relative">
                  <div
                    className={`file-upload-area bg-white/40 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed transition-all duration-300 group ${
                      isConverting
                        ? "border-blue-400 bg-blue-50/40"
                        : fileNames.length > 0
                        ? "border-green-400 bg-green-50/40"
                        : "border-slate-300 hover:border-blue-400 hover:bg-white/60"
                    }`}
                  >
                    <input
                      type="file"
                      multiple={true}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      {...register("memo")}
                      onChange={handleFileChange}
                      disabled={isConverting}
                    />

                    <div className="flex flex-col items-center justify-center text-slate-600">
                      {isConverting ? (
                        // Converting State
                        <div className="flex flex-col items-center space-y-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                              <Icon
                                icon="eos-icons:loading"
                                className="h-8 w-8 animate-spin text-white"
                              />
                            </div>
                            {/* Progress ring animation */}
                            <div className="absolute inset-0 w-16 h-16">
                              <svg
                                className="w-16 h-16 transform -rotate-90"
                                viewBox="0 0 64 64"
                              >
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                  className="text-blue-200"
                                />
                                <circle
                                  cx="32"
                                  cy="32"
                                  r="28"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                  strokeDasharray="175.92"
                                  strokeDashoffset="44"
                                  className="text-blue-500 animate-pulse"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className="text-sm font-semibold text-blue-600">
                              Processing files...
                            </span>
                            <p className="text-xs text-slate-500 mt-1">
                              Converting PDF and scanning text
                            </p>
                          </div>
                        </div>
                      ) : fileNames.length > 0 ? (
                        // Files Uploaded State
                        <div className="w-full space-y-4">
                          {/* Preview Area */}
                          <div className="relative">
                            <ImagePaginator
                              filePreviews={filePreviews}
                              currentPage={currentPage}
                            />

                            {/* File Counter Badge */}
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              {fileNames.length} file
                              {fileNames.length > 1 ? "s" : ""}
                            </div>
                          </div>

                          {/* File List */}
                          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-h-32 overflow-y-auto">
                            <div className="space-y-2">
                              {fileNames.map((fileName, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between text-xs bg-white/50 rounded-lg p-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon
                                      icon={
                                        fileName.endsWith(".pdf")
                                          ? "mdi:file-pdf"
                                          : "mdi:image"
                                      }
                                      className="h-4 w-4 text-blue-500"
                                    />
                                    <span className="font-medium text-slate-700 truncate max-w-32">
                                      {fileName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-600 font-medium">
                                      Ready
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Upload More Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const fileInput = document.querySelector(
                                'input[type="file"]'
                              ) as HTMLInputElement;
                              if (fileInput) fileInput.click();
                            }}
                            className="w-full py-3 px-4 bg-white/70 hover:bg-white/90 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 text-sm font-medium transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                          >
                            <Icon
                              icon="material-symbols:add"
                              className="h-4 w-4"
                            />
                            Add more files
                          </button>

                          {/* Clear All Files Button */}
                          <button
                            type="button"
                            onClick={clearAllFiles}
                            className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-red-600 hover:text-red-700 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <Icon
                              icon="material-symbols:delete-outline"
                              className="h-4 w-4"
                            />
                            Clear all files
                          </button>
                        </div>
                      ) : (
                        // Empty State
                        <div className="flex flex-col items-center space-y-4 group-hover:scale-105 transition-transform duration-300">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                              <Icon
                                icon="material-symbols:upload"
                                className="h-10 w-10 text-blue-600 group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            {/* Floating icons animation */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center group-hover:animate-bounce">
                              <Icon
                                icon="mdi:file-pdf"
                                className="h-3 w-3 text-red-500"
                              />
                            </div>
                            <div
                              className="absolute -bottom-1 -left-2 w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center group-hover:animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            >
                              <Icon
                                icon="mdi:image"
                                className="h-3 w-3 text-green-500"
                              />
                            </div>
                          </div>

                          <div className="text-center">
                            <span className="text-lg font-bold text-slate-700 block mb-1">
                              Drop files here
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                              or click to browse
                            </span>
                            <div className="mt-3 space-y-1">
                              <p className="text-xs text-slate-500">
                                Supported: PDF, JPG, PNG
                              </p>
                              <p className="text-xs text-slate-500">
                                Max: 25 files • Auto text extraction
                              </p>
                            </div>
                          </div>

                          {/* Supported formats preview */}
                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1">
                              <Icon
                                icon="mdi:file-pdf"
                                className="h-5 w-5 text-red-500"
                              />
                              <span className="text-xs text-slate-500">
                                PDF
                              </span>
                            </div>
                            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                            <div className="flex items-center gap-1">
                              <Icon
                                icon="mdi:image"
                                className="h-5 w-5 text-green-500"
                              />
                              <span className="text-xs text-slate-500">
                                Images
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* File count warning */}
                    {fileNames.length >= 20 && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                        <Icon
                          icon="material-symbols:warning"
                          className="h-5 w-5 text-amber-600"
                        />
                        <span className="text-sm text-amber-700">
                          {fileNames.length >= 25
                            ? "File limit reached (25/25)"
                            : `Approaching file limit (${fileNames.length}/25)`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Drag overlay */}
                  <div className="drag-overlay absolute inset-0 bg-blue-500/10 backdrop-blur-sm rounded-2xl border-2 border-blue-400 border-dashed opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center">
                      <Icon
                        icon="material-symbols:upload"
                        className="h-12 w-12 text-blue-600 mb-2"
                      />
                      <span className="text-lg font-bold text-blue-700">
                        Drop files here
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="w-[30%] h-full bg-white/60 backdrop-blur-lg border-l border-white/30 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-white/30 p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Post Settings
              </h2>
              <Button
                className="h-10 w-10 bg-white/70 hover:bg-white/90 text-slate-600 hover:text-slate-800 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border border-white/40"
                icon={`${PrimeIcons.TIMES}`}
                onClick={() => setVisible(false)}
              />
            </div>
          </div>

          {/* Settings Content */}
          <div className="p-6 space-y-6">
            {/* Employee Level Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Employee Level
              </label>
              <Dropdown
                className="w-full h-12 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                filter
                placeholder="Select employee level"
                value={selectedLevel}
                onChange={(e) => {
                  const lid = e.target.value.lid;
                  if (lid === 1) {
                    setSelectedDepartments([
                      ...departments.map((dept) => String(dept.deptId)),
                    ]);
                  } else {
                    setSelectedDepartments([]);
                  }
                  setSelectedLevel(e.target.value);
                }}
                options={levels}
                pt={{
                  root: {
                    className:
                      "bg-white/70 backdrop-blur-sm border-white/40 rounded-xl",
                  },
                  panel: {
                    className:
                      "bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/40",
                  },
                  header: {
                    className:
                      "bg-white/95 backdrop-blur-lg rounded-t-xl border-b border-white/40",
                  },
                  filterInput: {
                    className:
                      "bg-white/70 border border-white/40 rounded-lg h-10 px-3 text-sm",
                  },
                }}
                valueTemplate={selectedOptionTemplate}
                itemTemplate={levelOptionTemplate}
                optionLabel="level"
              />
            </div>

            {/* Departments */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Departments
              </label>
              <DepartmentsListMemo
                setSelectedDepartments={setSelectedDepartments}
                departments={departments}
                selectedDepartments={selectedDepartments}
              />
            </div>

            {/* Post Type */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Document Type
              </label>
              <Dropdown
                options={postTypesResponse?.data.postTypes}
                className="w-full h-12 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                optionLabel="name"
                value={postType}
                placeholder="Select document type"
                onChange={(e) => setPostType(e.value)}
                pt={{
                  root: {
                    className:
                      "bg-white/70 backdrop-blur-sm border-white/40 rounded-xl",
                  },
                  panel: {
                    className:
                      "bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white/40",
                  },
                }}
              />
            </div>

            {/* Folder Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Folder
              </label>
              <TreeSelect
                filter
                pt={{
                  root: {
                    className:
                      "bg-white/70 backdrop-blur-sm border-white/40 rounded-xl",
                  },
                  tree: {
                    root: {
                      className: "bg-white/95 backdrop-blur-lg rounded-xl",
                    },
                    content: { className: "bg-white/95 backdrop-blur-lg" },
                  },
                  wrapper: {
                    className: "bg-white/95 backdrop-blur-lg rounded-xl",
                  },
                  header: {
                    className: "bg-white/95 backdrop-blur-lg rounded-t-xl",
                  },
                  filter: {
                    className:
                      "bg-white/70 border border-white/40 rounded-lg text-slate-700",
                  },
                }}
                className="w-full h-12 bg-white/70 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                options={buildTree(foldersData?.data.folders || [])}
                onChange={async (e: TreeSelectChangeEvent) => {
                  const deptId = decodeUserData()?.deptId;
                  if (!e.value || !deptId) return;
                  const selected = await getFolderById(+e.value, deptId);
                  if (selected) setSelectedFolder(selected);
                }}
                value={selectedFolder?.id.toString()}
                placeholder="Select a folder"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              {/* Notify Recipients */}
              <div
                className={`relative h-12 border border-white/40 rounded-xl flex items-center gap-3 px-4 cursor-pointer transition-all duration-300 ${
                  notify
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/70"
                }`}
                onClick={() => setNotify((prev) => !prev)}
              >
                <Checkbox
                  id="notifyCheckbox"
                  value={notify}
                  checked={notify}
                  className="pointer-events-none"
                />
                <label
                  htmlFor="notifyCheckbox"
                  className="text-sm font-medium cursor-pointer"
                >
                  Notify recipients
                </label>
              </div>

              {/* Downloadable */}
              <div
                className={`relative h-12 border border-white/40 rounded-xl flex items-center gap-3 px-4 cursor-pointer transition-all duration-300 ${
                  downloadable
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/70"
                }`}
                onClick={() => setDownloadable((prev) => !prev)}
              >
                <Checkbox
                  id="downloadable"
                  value={downloadable}
                  checked={downloadable}
                  className="pointer-events-none"
                />
                <label
                  htmlFor="downloadable"
                  className="text-sm font-medium cursor-pointer"
                >
                  Downloadable
                </label>
              </div>

              {/* Publish */}
              <div
                className={`relative h-12 border border-white/40 rounded-xl flex items-center gap-3 px-4 cursor-pointer transition-all duration-300 ${
                  publish
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/70"
                }`}
                onClick={() => setPublish((prev) => !prev)}
              >
                <Checkbox
                  id="publish"
                  value={publish}
                  checked={publish}
                  className="pointer-events-none"
                />
                <label
                  htmlFor="publish"
                  className="text-sm font-medium cursor-pointer"
                >
                  Publish
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              icon={`${PrimeIcons.SAVE}`}
              className={`w-full justify-center h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 gap-3 ${
                posting ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isConverting || posting}
            >
              {posting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostModal;
