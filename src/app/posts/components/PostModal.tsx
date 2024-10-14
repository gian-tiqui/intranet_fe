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
  const toastClass =
    "bg-neutral-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handlePost = (data: FormFields) => {
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
      if (data.memo) formData.append("memo", data.memo[0]);

      apiClient
        .post(`${API_BASE}/post`, formData, {
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
          setVisible(false);
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
          <div>
            <p className="font-bold">
              {decodeUserData()?.firstName} {decodeUserData()?.lastName}
            </p>

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
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  {...register("memo")}
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  {fileName ? (
                    <Icon icon={"weui:done2-outlined"} className="h-10 w-10" />
                  ) : (
                    <Icon
                      icon={"material-symbols:upload"}
                      className="h-10 w-10"
                    />
                  )}
                  <span className="mt-2 text-sm">
                    {fileName || "Click to upload memo"}{" "}
                  </span>
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
