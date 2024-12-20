"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useDepartments from "@/app/custom-hooks/departments";
import { decodeUserData, fetchAllLevels } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useEditModalStore from "@/app/store/editModal";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { Level, Post } from "@/app/types/types";
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
import PostPreview from "./PostPreview";
import useSignalStore from "@/app/store/signalStore";

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
}

interface EditPostModalProps {
  postId: number | undefined;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ postId }) => {
  const departments = useDepartments();
  const { setShowEditModal } = useEditModalStore();
  const { setIsCollapsed } = useToggleStore();
  const { register, handleSubmit, setValue, watch } = useForm<FormFields>();
  const [loading, setLoading] = useState<boolean>(true);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showDepartments, setShowDepartments] = useState<boolean>(false);
  const { refetch } = useRefetchPostStore();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const { setSignal } = useSignalStore();

  const handleShowPreview = () => {
    const _title = watch("title");
    const _message = watch("message");

    setTitle(_title);
    setMessage(_message);

    if (_title && _message && filePreviews.length > 0) {
      setShowPreview(true);
    } else {
      toast("Please fill the fields", {
        className: toastClass,
        type: "error",
      });
    }
  };

  const handleCheckboxChange = (deptId: string) => {
    setSelectedDepartments((prevSelected) => {
      if (prevSelected.includes(deptId)) {
        return prevSelected.filter((id) => id !== deptId);
      } else {
        return [...prevSelected, deptId];
      }
    });
  };

  const [levels, setLevels] = useState<Level[]>([]);
  const { data, isError, error } = useQuery({
    queryKey: ["level"],
    queryFn: fetchAllLevels,
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
  }, [postId, setValue]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            toast(`Converting PDF: ${file.name}`, {
              type: "info",
              className: toastClass,
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
            toast(`Unsupported file format: ${file.name}`, {
              type: "error",
              className: toastClass,
            });
          }

          fileNames.push(file.name);
        }

        setFileNames(fileNames);
        setConvertedFiles(convertedFiles);
        setFilePreviews(previews);
        setValue("extractedText", extractedTexts.trim());
        toast("Files processed successfully!", {
          type: "success",
          className: toastClass,
        });
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

    if (at) {
      setSaving(true);
      const decode: { sub: number } = jwtDecode(at);

      data.userId = decode.sub;

      const formData = new FormData();
      formData.append("userId", String(data.userId));
      formData.append("lid", String(data.lid));
      formData.append("extractedText", data.extractedText?.toLowerCase());
      formData.append("deptIds", selectedDepartments.join(","));
      formData.append("updatedBy", String(data.userId));
      formData.append("addPhoto", data.addPhoto);
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);
      formData.append(
        "public",
        String(data.public === "public" ? "public" : "private")
      );

      convertedFiles.forEach((file) => {
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

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    if (checked) setValue("addPhoto", "true");
    else setValue("addPhoto", "false");
  };

  return (
    <div
      onClick={() => setShowEditModal(false)}
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
    >
      {showPreview && (
        <PostPreview
          title={title}
          message={message}
          filePreviews={filePreviews}
          setShowPreview={setShowPreview}
        />
      )}
      <form
        className="w-80 md:w-[420px] rounded-2xl bg-neutral-200 dark:bg-neutral-900 relative"
        onClick={handleFormClick}
        onSubmit={handleSubmit(handleEditPost)}
      >
        <div className="gap-3 mb-2">
          <div className="h-10 flex justify-between items-center rounded-t-2xl bg-white dark:bg-neutral-950 w-full p-4 border-b dark:border-black mb-3">
            <div className="w-full">
              <Icon
                icon={"akar-icons:cross"}
                className="h-4 w-4 cursor-pointer"
                // onClick={() => setVisible(false)}
              />
            </div>
            <p className="w-full text-center text-sm font-semibold">
              Edit Post
            </p>
            <div className="w-full flex justify-end">
              <button
                type="submit"
                className={`${
                  saving && "opacity-80"
                }  bg-inherit text-sm flex justify-end gap-1 items-center`}
                disabled={isConverting || saving}
              >
                {saving ? (
                  <>
                    {" "}
                    <Icon
                      icon={"material-symbols:post-add"}
                      className="h-5 w-5 animate-spin"
                    />
                  </>
                ) : (
                  <>
                    {" "}
                    <Icon
                      icon={"material-symbols:post-add"}
                      className="h-5 w-5"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-start gap-3 mx-4">
            <div className="rounded-full w-10 h-10 bg-gray-400"></div>

            <div className="bg-inherit text-sm w-full">
              <div className="flex justify-between items-center">
                <p className="font-bold">
                  {decodeUserData()?.firstName} {decodeUserData()?.lastName}
                </p>
                <div
                  className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 me-1 rounded"
                  onClick={handleShowPreview}
                >
                  <Icon icon={"mdi:eye-outline"} className="h-6 w-6 " />
                </div>
              </div>

              {loading ? (
                <div className="h-3 w-1/3 rounded bg-gray-300 animate-pulse"></div>
              ) : (
                <select
                  {...register("public", { required: true })}
                  className={`bg-inherit outline-none text-xs`}
                >
                  <option className="" value={"public"}>
                    Public
                  </option>
                  <option className="bg-inherit" value={"private"}>
                    Private
                  </option>
                </select>
              )}
            </div>
          </div>
          <div className="mx-3 pt-4">
            {loading ? (
              <div className="h-4 w-1/3 rounded bg-gray-300 animate-pulse mb-2"></div>
            ) : (
              <input
                className="w-full outline-none p-2 bg-inherit"
                placeholder="Memo title"
                {...register("title")}
              />
            )}
            <hr className="w-full border-b border border-gray-300 dark:border-neutral-800" />
            {loading ? (
              <>
                <div className="h-4 w-full rounded bg-gray-300 animate-pulse mb-2 mt-2"></div>
                <div className="h-4 w-full rounded bg-gray-300 animate-pulse mb-2 mt-2"></div>
                <div className="h-4 w-full rounded bg-gray-300 animate-pulse mb-2 mt-2"></div>
                <div className="h-4 w-2/3 rounded bg-gray-300 animate-pulse mb-10 mt-2"></div>
              </>
            ) : (
              <textarea
                className="w-full h-40 outline-none p-2 bg-inherit"
                placeholder="Edit your memo content"
                {...register("message")}
              />
            )}

            <div className="w-full p-4 mb-4 dark:bg-neutral-900 rounded-md">
              <div className="relative w-full border border-dashed border-neutral-400  dark:border-neutral-800 dark:bg-neutral-900 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200">
                <div
                  onClick={removeFile}
                  className="absolute right-0 top-0 h-7 w-7 bg-red-700 hover:bg-red-500 grid place-content-center text-white rounded-tr rounded-bl z-50 cursor-pointer"
                >
                  <Icon icon={"icomoon-free:cancel-circle"} />
                </div>

                <input
                  type="file"
                  multiple={true}
                  className="absolute inset-0 opacity-0 cursor-pointer border border-black"
                  {...register("memo")}
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center text-gray-500 ">
                  {loading ? (
                    <Icon icon={"line-md:loading-loop"} className="h-8 w-8" />
                  ) : fileNames ? (
                    <Icon icon={"weui:done2-outlined"} className="h-10 w-10" />
                  ) : (
                    <Icon
                      icon={"material-symbols:upload"}
                      className="h-10 w-10"
                    />
                  )}
                  {loading ? (
                    <>
                      <div className="h-4 w-full rounded bg-gray-300 animate-pulse my-1"></div>
                      <div className="h-4 w-2/3 rounded bg-gray-300 animate-pulse my-1"></div>
                    </>
                  ) : (
                    <span className="mt-2 text-sm">
                      {fileNames ? "File uploaded" : "Click to upload memo"}{" "}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-10 flex items-center gap-1 mb-4">
          <input type="checkbox" onChange={handleChangeCheckbox} />
          <p className="text-sm">Keep previous files?</p>
        </div>
        <div className="bg-white dark:bg-neutral-900 rounded-xl pb-3 px-4">
          <div className="h-7 flex w-full justify-center items-center">
            <Icon icon={"octicon:dash-16"} className="w-7 h-7" />
          </div>
          <div className="flex items-center px-5">
            <Icon
              icon={"arcticons:emoji-department-store"}
              className="h-4 w-4"
            />
            <select
              {...register("lid", { required: true })}
              onChange={(e) => {
                const lid = e.target.value;

                if (lid === "1") {
                  setSelectedDepartments([
                    ...departments.map((dept) => String(dept.deptId)),
                  ]);
                } else if (["4", "5"].includes(lid)) {
                  setSelectedDepartments(["9"]);
                } else {
                  setSelectedDepartments([]);
                }
              }}
              className="w-full bg-inherit rounded-t-xl h-9  text-sm gap-1 outline-none"
            >
              <option value={""}>Select employee level</option>
              {levels.map((level) => (
                <option
                  value={level.lid}
                  className="w-full border rounded-xl h-10 bg-white dark:bg-neutral-900"
                  key={level.lid}
                >
                  {level.level[0].toUpperCase() + level.level.substring(1)}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => setShowDepartments(!showDepartments)}
            className="h-8 gap-1 cursor-pointer px-5 flex items-center relative"
          >
            <Icon
              icon={"arcticons:emoji-department-store"}
              className="h-4 w-4"
            />
            <p className="text-sm">Select department/s</p>
          </div>
          {showDepartments && (
            <DepartmentsList
              departments={departments}
              handleCheckboxChange={handleCheckboxChange}
              selectedDepartments={selectedDepartments}
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default EditPostModal;
