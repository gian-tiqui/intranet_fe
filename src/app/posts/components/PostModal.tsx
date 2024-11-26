"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useDepartments from "@/app/custom-hooks/departments";
import { decodeUserData, fetchAllLevels } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import useShowPostStore from "@/app/store/showPostStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { pdfjs } from "react-pdf";
import { Level } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import { createWorker } from "tesseract.js";
import DepartmentsList from "./DepartmentsList";
import { jwtDecode } from "jwt-decode";
import PostPreview from "./PostPreview";

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
}

interface Props {
  isMobile: boolean;
}

const PostModal: React.FC<Props> = ({ isMobile }) => {
  const { setVisible } = useShowPostStore();
  const { setIsCollapsed } = useToggleStore();
  const departments = useDepartments();
  const { register, handleSubmit, setValue, watch } = useForm<FormFields>();
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const toastClass =
    "bg-neutral-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white";
  const [posting, setPosting] = useState<boolean>(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showDepartments, setShowDepartments] = useState<boolean>(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const { data, isError, error } = useQuery({
    queryKey: ["level"],
    queryFn: fetchAllLevels,
  });

  useEffect(() => {
    const closeDepts = () => {
      if (showDepartments) {
        setShowDepartments(false);
      }
    };

    document.addEventListener("click", closeDepts);

    return () => document.removeEventListener("click", closeDepts);
  }, [showDepartments]);

  const handleCheckboxChange = (deptId: string) => {
    setSelectedDepartments((prevSelected) => {
      if (prevSelected.includes(deptId)) {
        return prevSelected.filter((id) => id !== deptId);
      } else {
        return [...prevSelected, deptId];
      }
    });
  };

  useEffect(() => {
    setValue("deptIds", selectedDepartments.join(","));
  }, [selectedDepartments, setValue]);

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const fileNames: string[] = [];
      let extractedTexts = "";
      const convertedFiles: File[] = [];
      const previews: string[] = [];

      setIsConverting(true);
      for (const file of files) {
        try {
          if (file.type === "application/pdf") {
            toast(`Converting PDF: ${file.name}`, {
              type: "info",
              className: toastClass,
            });

            const convertedImages = await convertPdfToImage(file);

            convertedImages.map(async (convertedImage) => {
              convertedFiles.push(convertedImage);

              const text = await scanImage(URL.createObjectURL(convertedImage));
              extractedTexts += text + " ";
              previews.push(URL.createObjectURL(convertedImage));
            });
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
        } catch (error) {
          console.error("Error processing file:", file.name, error);
        }
      }

      setFileNames(fileNames);
      setConvertedFiles(convertedFiles);
      setValue("extractedText", extractedTexts.trim());
      setIsConverting(false);
      setFilePreviews(previews);

      toast("Files processed successfully!", {
        type: "success",
        className: toastClass,
      });
    }
  };

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

  const handlePost = async (data: FormFields) => {
    if (convertedFiles.length >= 25) {
      toast("You have exceeded the file limit", {
        className: toastClass,
        type: "error",
      });
      return;
    }
    if (isConverting) {
      toast("Please wait for file processing to complete", {
        type: "info",
        className: toastClass,
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
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);

      convertedFiles.forEach((file) => {
        formData.append("memo", file);
      });

      try {
        const response = await apiClient.post(`${API_BASE}/post`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          setVisible(false);
          toast(response.data.message, {
            type: "success",
            className: toastClass,
          });

          const notifications = data.deptIds.split(",").map((deptId) =>
            apiClient
              .post(`${API_BASE}/notification/new-post`, null, {
                params: {
                  deptId: deptId,
                  postId: response.data.post.pid,
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
                },
              })
              .then(() => {
                toast("Notification sent to the department!", {
                  type: "success",
                  className: toastClass,
                });
              })
              .catch((error) => {
                console.error("Failed to send notification:", error);
              })
          );

          Promise.all(notifications)
            .then(() => {
              console.log("All notifications sent successfully!");
            })
            .catch(() => {
              console.error("Some notifications failed.");
            })
            .finally(() => setPosting(false));
        }
      } catch (error) {
        console.error(error);
        toast("Error creating post", {
          type: "error",
          className: toastClass,
        });
      } finally {
        setPosting(false);
      }
    }
  };

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [setIsCollapsed, isMobile]);

  return (
    <div
      onClick={() => setVisible(false)}
      className="min-w-full min-h-full bg-black bg-opacity-85 dark:bg-black/50 absolute z-50 grid place-content-center"
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
        onSubmit={handleSubmit(handlePost)}
        className="w-80 md:w-[400px] rounded-2xl bg-neutral-200 dark:bg-neutral-900"
        onClick={handleFormClick}
      >
        <div className="h-10 flex justify-between items-center rounded-t-2xl bg-white dark:bg-neutral-950 w-full p-4 border-b dark:border-black mb-3">
          <div className="w-full">
            <Icon
              icon={"akar-icons:cross"}
              className="h-4 w-4 cursor-pointer"
              onClick={() => setVisible(false)}
            />
          </div>
          <p className="w-full text-center text-sm font-semibold">
            Create Post
          </p>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className={`${
                posting && "opacity-80"
              }  bg-inherit text-sm flex justify-end gap-1 items-center`}
              disabled={isConverting || posting}
            >
              {posting ? (
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
        <div className="flex items-start gap-3 mb-2 mx-4">
          <div className="rounded-full w-12 h-10 bg-gray-400"></div>
          <div className="w-full">
            <div className="flex justify-between">
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

            <div className="bg-inherit text-sm">
              <select
                {...register("public", { required: true })}
                className="bg-inherit outline-none text-xs"
              >
                <option className="" value={"public"}>
                  Public
                </option>
                <option className="bg-inherit" value={"private"}>
                  Private
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="relative mx-4">
          <div>
            <input
              className="w-full outline-none p-2 bg-inherit placeholder-neutral-600"
              placeholder="Memo title"
              {...register("title")}
            />
            <hr className="w-full border-b border border-neutral-300 dark:border-neutral-800" />
            <textarea
              className="w-full h-40 outline-none p-2 bg-inherit placeholder-neutral-600"
              placeholder="Is there something you want to write for the memo?"
              {...register("message")}
            />

            <div className="w-full p-4 mb-4 dark:bg-neutral-900 rounded-md">
              <div className="relative w-full border border-dashed border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 rounded-md p-4 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all duration-200">
                <input
                  type="file"
                  multiple={true}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  {...register("memo")}
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  {isConverting ? (
                    <div className="flex flex-col items-center">
                      <Icon
                        icon="eos-icons:loading"
                        className="h-10 w-10 animate-spin"
                      />
                      <span className="mt-2 text-sm">Converting PDF...</span>
                    </div>
                  ) : fileNames.length > 0 ? (
                    <div className="flex flex-col items-center">
                      <Icon
                        icon={"weui:done2-outlined"}
                        className="h-10 w-10"
                      />
                      <div className="flex flex-wrap">Files Uploaded</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Icon
                        icon={"material-symbols:upload"}
                        className="h-10 w-10"
                      />
                      <span className="mt-2 text-sm">
                        Click to upload memo (PDF or Image)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-t bg-white dark:bg-neutral-950 dark:border-black relative pb-2">
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

export default PostModal;
