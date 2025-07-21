"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useDepartments from "@/app/custom-hooks/departments";
import {
  decodeUserData,
  fetchAllLevels,
  getFolderById,
} from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useEditModalStore from "@/app/store/editModal";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { Folder, Level, Post, PostType, Query } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { pdfjs } from "react-pdf";
import { toast } from "react-toastify";
import { createWorker } from "tesseract.js";
import DepartmentsList from "./DepartmentsList";
import useRefetchPostStore from "@/app/store/refetchPostStore";
import useSignalStore from "@/app/store/signalStore";
import { Dropdown, DropdownProps } from "primereact/dropdown";
import { MultiStateCheckbox } from "primereact/multistatecheckbox";
import { getFolders } from "@/app/utils/service/folderService";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { getPostTypes } from "@/app/utils/service/postTypeService";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface FormFields {
  userId: number;
  message?: string;
  memo?: FileList;
  title?: string;
  public?: string;
  lid: number;
  extractedText: string;
  addPhoto: string;
  folderId?: number;
  isPublished: number;
  downloadable: number;
  typeId: number;
}

interface EditPostModalProps {
  postId: number | undefined;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ postId }) => {
  const departments = useDepartments();
  const { setShowEditModal } = useEditModalStore();
  const { setIsCollapsed } = useToggleStore();
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const [loading, setLoading] = useState<boolean>(true);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const { refetch } = useRefetchPostStore();
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>(
    undefined
  );
  const [postType, setPostType] = useState<PostType | undefined>(undefined);
  const [downloadable, setDownloadable] = useState<boolean>(false);
  const [publish, setPublish] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | undefined>(
    undefined
  );
  const [foldersQuery] = useState<Query>({
    includeSubfolders: 0,
    search: "",
    skip: 0,
    take: 500,
    isPublished: 1,
  });
  const [postVisibility, setPostVisibility] = useState<string>("public");
  const options: { value: string; icon: string }[] = [
    {
      value: "public",
      icon: "pi pi-globe",
    },
    { value: "private", icon: "pi pi-lock" },
  ];
  const { setSignal } = useSignalStore();

  const { data: foldersData } = useQuery({
    queryKey: [`folders-${JSON.stringify(foldersQuery)}`],
    queryFn: () => getFolders(foldersQuery),
  });

  const [levels, setLevels] = useState<Level[]>([]);
  const { data, isError, error } = useQuery({
    queryKey: ["level"],
    queryFn: fetchAllLevels,
  });

  const { data: postTypesResponse } = useQuery({
    queryKey: [`post-types`],
    queryFn: () => getPostTypes(),
  });

  const scanImage = async (imageUrl: string): Promise<string> => {
    const worker = await createWorker("eng");
    try {
      setLoading(true);
      const {
        data: { text },
      } = await worker.recognize(imageUrl);
      return text.toLowerCase();
    } catch (error) {
      console.error("Error scanning image:", error);
      return "";
    } finally {
      await worker.terminate();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postVisibility) setValue("public", postVisibility);
  }, [postVisibility, setValue]);

  useEffect(() => {
    if (data) setLevels(data);
  }, [data]);

  if (isError) console.error(error);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiClient.get(`${API_BASE}/post/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        });
        const post: Post = response.data.post;

        setValue("title", post.title);
        setValue("message", post.message);
        setValue("lid", post.lid);
        setSelectedFolder(post.folder);
        setValue("folderId", post.folderId);
        const selectedDeptIds = [
          ...post.postDepartments.map((postDept) =>
            postDept.department.deptId.toString()
          ),
        ];
        setValue("isPublished", post.isPublished ? 1 : 0);
        if (post.isPublished) setPublish(true);
        else setPublish(false);
        setValue("downloadable", post.downloadable ? 1 : 0);
        if (post.downloadable) setDownloadable(true);
        else setDownloadable(false);

        setSelectedDepartments(selectedDeptIds);

        setSelectedLevel(levels.find((level) => level.lid === post.lid));
        setPostType(post.type);
        setValue("typeId", parseInt(post.type.id.toString(), 10));

        if (post.imageLocations != null) {
          setFileNames([
            ...post?.imageLocations.map(
              (imageLocation) => imageLocation.imageLocation
            ),
          ]);
        }
      } catch (error) {
        const err = error as { response: { data: { message: string } } };
        toast(err.response.data.message, {
          type: "error",
          className: toastClass,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, setValue, levels]);

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

  useEffect(() => {
    if (downloadable) setValue("downloadable", 1);
    else setValue("downloadable", 0);
  }, [downloadable, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate file sizes (e.g., max 10MB per file)
      const maxSize = 10 * 1024 * 1024; // 10MB
      const oversizedFiles = files.filter((file) => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        toast(
          `Some files are too large (max 10MB): ${oversizedFiles
            .map((f) => f.name)
            .join(", ")}`,
          {
            type: "warning",
            className: toastClass,
          }
        );
        // Remove oversized files
        const validFiles = files.filter((file) => file.size <= maxSize);
        if (validFiles.length === 0) return;
      }

      const fileNames: string[] = [];
      const previews: string[] = [];
      let extractedTexts = "";
      const convertedFiles: File[] = [];

      setIsConverting(true);

      try {
        let processedCount = 0;
        const totalFiles = files.length;

        for (const file of files) {
          // Update progress
          toast(
            `Processing file ${processedCount + 1} of ${totalFiles}: ${
              file.name
            }`,
            {
              type: "info",
              className: toastClass,
              autoClose: 2000,
            }
          );

          if (file.type === "application/pdf") {
            try {
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
            } catch (error) {
              console.error(`Error processing PDF ${file.name}:`, error);
              toast(`Failed to process PDF: ${file.name}`, {
                type: "error",
                className: toastClass,
              });
            }
          } else if (file.type.startsWith("image/")) {
            try {
              const text = await scanImage(URL.createObjectURL(file));
              extractedTexts += text + " ";
              convertedFiles.push(file);
              previews.push(URL.createObjectURL(file));
            } catch (error) {
              console.error(`Error processing image ${file.name}:`, error);
              toast(`Failed to process image: ${file.name}`, {
                type: "error",
                className: toastClass,
              });
            }
          } else {
            toast(`Unsupported file format: ${file.name}`, {
              type: "warning",
              className: toastClass,
            });
          }

          fileNames.push(file.name);
          processedCount++;
        }

        if (convertedFiles.length > 0) {
          setFileNames(fileNames);
          setConvertedFiles(convertedFiles);
          setFilePreviews(previews);
          setValue("extractedText", extractedTexts.trim());
          setCurrentPage(0); // Reset to first page

          toast(`Successfully processed ${convertedFiles.length} files!`, {
            type: "success",
            className: toastClass,
          });
        }
      } catch (error) {
        console.error("Error processing files:", error);
        toast("An error occurred while processing files.", {
          type: "error",
          className: toastClass,
        });
      } finally {
        setIsConverting(false);
      }
    }
  };

  const handleEditPost = (data: FormFields) => {
    const at = localStorage.getItem(INTRANET);

    if (!postVisibility || postVisibility == "") {
      toast("Please select post visibility.", {
        type: "error",
        className: toastClass,
      });
      return;
    }

    if (at) {
      setSaving(true);
      const decode: { sub: number } = jwtDecode(at);

      data.userId = decode.sub;

      const formData = new FormData();
      formData.append("lid", String(data.lid));
      formData.append("extractedText", data.extractedText?.toLowerCase());
      formData.append("deptIds", selectedDepartments.join(","));
      formData.append("updatedBy", String(data.userId));
      formData.append("addPhoto", data.addPhoto);
      if (selectedFolder?.id !== undefined) {
        formData.append("folderId", String(selectedFolder.id));
      }
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);
      formData.append(
        "public",
        String(data.public === "public" ? "public" : "private")
      );
      formData.append("downloadable", data.downloadable.toString());
      formData.append("isPublished", data.isPublished.toString());
      formData.append("typeId", postType ? postType.id.toString() : "1");

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
        formData.append("newMemo", file);
      });

      apiClient
        .put(`${API_BASE}/post/${postId}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast(response.data.message, {
            type: "success",
            className: toastClass,
          });

          setShowEditModal(false);
          setSignal(true);

          refetch();
        })
        .catch((error) => {
          toast(error.message, { type: "error", className: toastClass });
        })
        .finally(() => {
          setSaving(false);
          setSignal(false);
        });
    }
  };

  useEffect(() => {
    setIsCollapsed(true);
    return () => setIsCollapsed(false);
  }, [setIsCollapsed]);

  const removeFile = () => {
    setValue("memo", undefined);
    setFileNames([]);
    setConvertedFiles([]);
  };

  useEffect(() => {
    if (isChecked) setValue("addPhoto", "true");
    else setValue("addPhoto", "false");
  }, [isChecked, setValue]);

  useEffect(() => {
    if (publish) setValue("isPublished", 1);
    else setValue("isPublished", 0);
  }, [publish, setValue]);

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
      onSubmit={handleSubmit(handleEditPost)}
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
                    {loading ? (
                      <div className="h-3 w-24 rounded bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                    ) : (
                      <>
                        <MultiStateCheckbox
                          value={postVisibility}
                          options={options}
                          onChange={(e) => setPostVisibility(e.value)}
                          optionValue="value"
                        />
                        <span className="font-medium text-slate-700">
                          {postVisibility || "Select visibility"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/30 p-8">
              <div className="space-y-6">
                {/* Title Input */}
                <div className="relative">
                  {loading ? (
                    <div className="h-14 w-full rounded-2xl bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 animate-pulse"></div>
                  ) : (
                    <input
                      className="w-full outline-none p-4 bg-white/50 backdrop-blur-sm rounded-2xl placeholder-slate-500 text-xl font-semibold border border-white/40 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Edit your memo title..."
                      {...register("title")}
                    />
                  )}
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
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 w-full rounded bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                      <div className="h-4 w-full rounded bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                      <div className="h-4 w-full rounded bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                      <div className="h-4 w-2/3 rounded bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse"></div>
                    </div>
                  ) : (
                    <textarea
                      className="w-full outline-none p-4 bg-white/50 backdrop-blur-sm rounded-2xl placeholder-slate-500 resize-none overflow-hidden min-h-[120px] border border-white/40 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                      placeholder="Edit your memo content..."
                      {...register("message")}
                      onInput={(e) => {
                        e.currentTarget.style.height = "auto";
                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                      }}
                    />
                  )}
                </div>

                <div className="relative">
                  <div
                    className={`bg-white/40 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-300 relative ${
                      fileNames.length > 0
                        ? "border-solid border-green-300 bg-green-50/40"
                        : "border-dashed border-slate-300 hover:border-blue-400 hover:bg-white/60"
                    } ${
                      isConverting ? "border-blue-400 bg-blue-50/40" : ""
                    } group`}
                  >
                    {/* Loading Overlay */}
                    {isConverting && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                        <div className="relative mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <Icon
                              icon="line-md:loading-loop"
                              className="h-8 w-8 text-white"
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-slate-700 mb-2">
                            Processing files...
                          </p>
                          <p className="text-sm text-slate-600">
                            Converting PDFs and extracting text
                          </p>
                        </div>
                      </div>
                    )}

                    {/* File Upload Input - Only active when no files uploaded */}
                    {fileNames.length === 0 && (
                      <input
                        type="file"
                        multiple={true}
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        {...register("memo")}
                        onChange={handleFileChange}
                        disabled={isConverting || saving}
                      />
                    )}

                    {/* Content based on state */}
                    {fileNames.length > 0 ? (
                      // Files uploaded state
                      <div className="w-full">
                        {/* Header with file count and actions */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                              <Icon
                                icon="weui:done2-outlined"
                                className="h-6 w-6 text-green-600"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-700">
                                {fileNames.length} file
                                {fileNames.length > 1 ? "s" : ""} uploaded
                              </p>
                              <p className="text-sm text-slate-600">
                                {convertedFiles.length} image
                                {convertedFiles.length > 1 ? "s" : ""} ready for
                                preview
                              </p>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            {/* Hidden file input for replace functionality */}
                            <input
                              ref={(ref) => {
                                // Store reference for programmatic access
                                if (ref) {
                                  (
                                    window as Window & {
                                      replaceFileInput?: HTMLInputElement | null;
                                    }
                                  ).replaceFileInput = ref;
                                }
                              }}
                              type="file"
                              multiple={true}
                              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp"
                              className="hidden"
                              onChange={handleFileChange}
                              disabled={isConverting || saving}
                            />

                            {/* Replace files button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                type WindowWithReplaceFileInput = Window & {
                                  replaceFileInput?: HTMLInputElement | null;
                                };
                                const fileInput = (
                                  window as WindowWithReplaceFileInput
                                ).replaceFileInput;
                                if (fileInput && !isConverting && !saving) {
                                  fileInput.click();
                                }
                              }}
                              className="h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
                              disabled={isConverting || saving}
                            >
                              <Icon
                                icon="material-symbols:refresh"
                                className="h-4 w-4"
                              />
                              Replace
                            </button>

                            {/* Remove all files button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                removeFile();
                              }}
                              className="h-9 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
                              disabled={isConverting || saving}
                            >
                              <Icon
                                icon="material-symbols:delete-outline"
                                className="h-4 w-4"
                              />
                              Remove All
                            </button>
                          </div>
                        </div>

                        {/* File list */}
                        <div className="bg-white/60 rounded-xl p-4 mb-4 max-h-32 overflow-y-auto">
                          <div className="space-y-2">
                            {fileNames.map((fileName, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-2 bg-white/70 rounded-lg"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                  <Icon
                                    icon={
                                      fileName.toLowerCase().includes(".pdf")
                                        ? "material-symbols:picture-as-pdf"
                                        : "material-symbols:image"
                                    }
                                    className="h-4 w-4 text-slate-600"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-700 truncate">
                                    {fileName}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {fileName.toLowerCase().includes(".pdf")
                                      ? "PDF Document"
                                      : "Image File"}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Upload more files area */}
                        <div
                          className="mt-4 p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-white/60 transition-all duration-300 group/upload cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            type WindowWithReplaceFileInput = Window & {
                              replaceFileInput?: HTMLInputElement | null;
                            };
                            const fileInput = (
                              window as WindowWithReplaceFileInput
                            ).replaceFileInput;
                            if (fileInput && !isConverting && !saving) {
                              fileInput.click();
                            }
                          }}
                        >
                          <div className="flex items-center justify-center gap-3 text-slate-600 group-hover/upload:text-blue-600">
                            <Icon
                              icon="material-symbols:add"
                              className="h-5 w-5"
                            />
                            <span className="text-sm font-medium">
                              Click to add more files
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // No files uploaded state
                      <div className="flex flex-col items-center space-y-4 group-hover:scale-105 transition-transform duration-300">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                          <Icon
                            icon="material-symbols:upload"
                            className="h-10 w-10 text-blue-600"
                          />
                        </div>
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-slate-700 mb-2">
                            Upload new memo files
                          </h3>
                          <p className="text-sm text-slate-600 mb-2">
                            Drag and drop your files here, or click to browse
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500">
                            <span className="bg-white/60 px-2 py-1 rounded">
                              PDF
                            </span>
                            <span className="bg-white/60 px-2 py-1 rounded">
                              JPEG
                            </span>
                            <span className="bg-white/60 px-2 py-1 rounded">
                              PNG
                            </span>
                            <span className="bg-white/60 px-2 py-1 rounded">
                              GIF
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Progress indicator */}
                  {isConverting && (
                    <div className="mt-3">
                      <div className="w-full bg-white/60 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 text-center">
                        Processing files and extracting text...
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhanced File Preview Navigation - Updated positioning */}
                {filePreviews.length > 0 && (
                  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 h-16 px-6 items-center z-50 flex justify-between min-w-[280px]">
                    <Button
                      type="button"
                      className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 justify-center text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
                      onClick={() => {
                        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
                      }}
                      disabled={currentPage === 0}
                      icon={`${PrimeIcons.ARROW_LEFT}`}
                    />

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-slate-700">
                        {currentPage + 1} / {filePreviews.length}
                      </p>
                      <div className="flex gap-1">
                        {filePreviews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentPage
                                ? "bg-blue-500 scale-125"
                                : "bg-slate-300 hover:bg-slate-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 justify-center text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
                      onClick={() => {
                        if (currentPage < filePreviews.length - 1)
                          setCurrentPage((prev) => prev + 1);
                      }}
                      disabled={currentPage === filePreviews.length - 1}
                      icon={`${PrimeIcons.ARROW_RIGHT}`}
                    />
                  </div>
                )}

                {/* Enhanced File Preview Navigation - Updated positioning */}
                {filePreviews.length > 0 && (
                  <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 h-16 px-6 items-center z-50 flex justify-between min-w-[280px]">
                    <Button
                      type="button"
                      className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 justify-center text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
                      onClick={() => {
                        if (currentPage > 0) setCurrentPage((prev) => prev - 1);
                      }}
                      disabled={currentPage === 0}
                      icon={`${PrimeIcons.ARROW_LEFT}`}
                    />

                    <div className="flex items-center gap-3">
                      <p className="text-sm font-semibold text-slate-700">
                        {currentPage + 1} / {filePreviews.length}
                      </p>
                      <div className="flex gap-1">
                        {filePreviews.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                              index === currentPage
                                ? "bg-blue-500 scale-125"
                                : "bg-slate-300 hover:bg-slate-400"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      type="button"
                      className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 justify-center text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border-0"
                      onClick={() => {
                        if (currentPage < filePreviews.length - 1)
                          setCurrentPage((prev) => prev + 1);
                      }}
                      disabled={currentPage === filePreviews.length - 1}
                      icon={`${PrimeIcons.ARROW_RIGHT}`}
                    />
                  </div>
                )}
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
                Edit Post Settings
              </h2>
              <Button
                className="h-10 w-10 bg-white/70 hover:bg-white/90 text-slate-600 hover:text-slate-800 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 border border-white/40"
                icon={`${PrimeIcons.TIMES}`}
                onClick={() => setShowEditModal(false)}
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
              <DepartmentsList
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
              {/* Keep Previous Files */}
              <div
                className={`relative h-12 border border-white/40 rounded-xl flex items-center gap-3 px-4 cursor-pointer transition-all duration-300 ${
                  isChecked
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg"
                    : "bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-white/70"
                }`}
                onClick={() => setIsChecked((prev) => !prev)}
              >
                <Checkbox
                  id="keepFilesCheckbox"
                  value={isChecked}
                  checked={isChecked}
                  className="pointer-events-none"
                />
                <label
                  htmlFor="keepFilesCheckbox"
                  className="text-sm font-medium cursor-pointer"
                >
                  Keep previous files
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
              icon={`${PrimeIcons.UNDO}`}
              className={`w-full justify-center h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 gap-3 ${
                isConverting || saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isConverting || saving}
            >
              {saving ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditPostModal;
