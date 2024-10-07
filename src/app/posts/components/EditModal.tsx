"use client";
import { API_BASE, INTRANET } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useEditModalStore from "@/app/store/editModal";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { Post } from "@/app/types/types";
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
}

interface EditPostModalProps {
  postId: number | undefined;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ postId }) => {
  const { setShowEditModal } = useEditModalStore();
  const { setIsCollapsed } = useToggleStore();
  const { register, handleSubmit, setValue } = useForm<FormFields>();
  const [fileName, setFileName] = useState<string | undefined>("");
  const toastClass =
    "bg-neutral-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 text-black dark:text-white";

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
        setFileName(post?.imageLocation?.split("post/")[1]);
      } catch (error) {
        const err = error as { response: { data: { message: string } } };
        toast(err.response.data.message, {
          type: "error",
          className: toastClass,
        });
      }
    };

    fetchPost();
  }, [postId, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleEditPost = (data: FormFields) => {
    const at = localStorage.getItem(INTRANET);

    if (at) {
      const decode: { sub: number } = jwtDecode(at);

      data.userId = decode.sub;

      const formData = new FormData();
      formData.append("userId", String(data.userId));
      formData.append("deptId", String(data.deptId));
      if (data.title) formData.append("title", data.title);
      if (data.message) formData.append("message", data.message);
      if (data.memo && data.memo.length > 0)
        formData.append("newMemo", data.memo[0]);

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
          window.location.reload();
        })
        .catch((error) => {
          toast(error.message, { type: "error", className: toastClass });
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
      onClick={() => setShowEditModal(false)}
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
    >
      <div
        className="p-4 w-80 rounded-2xl bg-white dark:bg-neutral-900"
        onClick={handleFormClick}
      >
        <div className="flex items-start gap-3 mb-2">
          <div className="rounded-full w-10 h-10 bg-gray-400"></div>
          <p className="font-bold">
            {decodeUserData()?.firstName} {decodeUserData()?.lastName}
          </p>
        </div>
        <form onSubmit={handleSubmit(handleEditPost)}>
          <div>
            <input
              className="w-full outline-none p-2 dark:bg-neutral-900"
              placeholder="Memo title"
              {...register("title")}
            />
            <hr className="w-full border-b border dark:border-neutral-800" />
            <textarea
              className="w-full h-40 outline-none p-2 dark:bg-neutral-900"
              placeholder="Edit your memo content"
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

            <button
              type="submit"
              className="w-full border rounded-xl h-10 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
