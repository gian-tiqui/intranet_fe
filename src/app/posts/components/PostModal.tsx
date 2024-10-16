"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import useDepartments from "@/app/custom-hooks/departments";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import useShowPostStore from "@/app/store/showPostStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs"; // ???

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface FormFields {
  userId: number;
  deptId: number;
  message?: string;
  memo?: FileList;
  title?: string;
  public: boolean;
}

const PostModal = () => {
  const { setVisible } = useShowPostStore();
  const { setIsCollapsed } = useToggleStore();
  const departments = useDepartments();
  const { register, handleSubmit } = useForm<FormFields>();
  const [fileName, setFileName] = useState<string>("");
  const [convertedFile, setConvertedFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const toastClass =
    "bg-neutral-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white";

  const convertPdfToImage = async (pdfFile: File): Promise<File> => {
    try {
      setIsConverting(true);

      const arrayBuffer = await pdfFile.arrayBuffer();

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

      const page = await pdf.getPage(1);

      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Could not get canvas context");
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page to canvas
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

      const convertedImageFile = new File(
        [blob],
        pdfFile.name.replace(".pdf", ".jpg"),
        { type: "image/jpeg" }
      );

      setIsConverting(false);
      return convertedImageFile;
    } catch (error) {
      setIsConverting(false);
      console.error("Error converting PDF to image:", error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);

      if (file.type === "application/pdf") {
        try {
          toast("Converting PDF to image...", {
            type: "info",
            className: toastClass,
          });

          const convertedImage = await convertPdfToImage(file);
          setConvertedFile(convertedImage);

          toast("PDF converted successfully!", {
            type: "success",
            className: toastClass,
          });
        } catch (error) {
          console.error("File conversion error:", error);
          toast("Error converting PDF to image", {
            type: "error",
            className: toastClass,
          });
          setFileName("");
          setConvertedFile(null);
        }
      } else {
        setConvertedFile(null);
      }
    }
  };

  const handlePost = (data: FormFields) => {
    if (isConverting) {
      toast("Please wait for PDF conversion to complete", {
        type: "info",
        className: toastClass,
      });
      return;
    }

    const at = localStorage.getItem(INTRANET);

    if (at) {
      const decode: { sub: number } = jwtDecode(at);
      data.userId = decode.sub;

      const formData = new FormData();
      formData.append("userId", String(data.userId));
      formData.append("deptId", String(data.deptId));
      formData.append("public", String(data.public));
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);

      if (convertedFile) {
        formData.append("memo", convertedFile);
      } else if (data.memo && data.memo[0]) {
        formData.append("memo", data.memo[0]);
      }

      apiClient
        .post(`${API_BASE}/post`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          setVisible(false);

          apiClient
            .post(`${API_BASE}/notification/new-post`, null, {
              params: {
                deptId: data.deptId,
                postId: response.data.post.post.pid,
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
            });
        })
        .catch((error) => {
          toast(error, { type: "error", className: toastClass });
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

  return (
    <div
      onClick={() => setVisible(false)}
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
    >
      <div
        className="p-4 w-80 rounded-2xl bg-white dark:bg-neutral-900"
        onClick={handleFormClick}
      >
        <div className="flex items-start gap-3 mb-2">
          <div className="rounded-full w-10 h-10 bg-gray-400"></div>
          <div className="w-full">
            <div className="flex justify-between">
              <p className="font-bold">
                {decodeUserData()?.firstName} {decodeUserData()?.lastName}
              </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 text-sm">
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

        <form onSubmit={handleSubmit(handlePost)}>
          <div>
            <input
              className="w-full outline-none p-2 dark:bg-neutral-900"
              placeholder="Memo title"
              {...register("title")}
            />
            <hr className="w-full border-b border dark:border-neutral-800" />
            <textarea
              className="w-full h-40 outline-none p-2 dark:bg-neutral-900"
              placeholder="Is there something you want to write for the memo?"
              {...register("message")}
            />

            <div className="w-full p-4 mb-4 dark:bg-neutral-900 rounded-md">
              <div className="relative w-full border border-dashed border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200">
                <input
                  type="file"
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
                  ) : fileName ? (
                    <div className="flex flex-col items-center">
                      <Icon
                        icon={"weui:done2-outlined"}
                        className="h-10 w-10"
                      />
                      <span className="mt-2 text-sm">{fileName}</span>
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
            <select
              {...register("deptId", { required: true })}
              className="w-full bg-inherit border rounded-xl h-9 text-center mb-4 border-neutral-300 dark:border-neutral-700 text-sm gap-1 outline-none"
            >
              <option value={""}>Select a department</option>
              {departments.map((department) => (
                <option
                  value={department.deptId}
                  className="w-full border rounded-xl h-10 bg-white dark:bg-neutral-900"
                  key={department.deptId}
                >
                  {department.departmentName[0].toUpperCase() +
                    department.departmentName.substring(1).toLowerCase()}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full border rounded-xl h-10 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700"
              disabled={isConverting}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
