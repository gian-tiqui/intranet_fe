import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import useAdminHiderStore from "@/app/store/adminOpacitor";
import useDeletePostStore from "@/app/store/deletePost";
import usePostIdStore from "@/app/store/postId";
import React from "react";
import { toast } from "react-toastify";

const DeletePostModal = () => {
  // User ID global variable.
  const { postId } = usePostIdStore();

  // A container that will block the UI aside from the focused form component.
  const { setAShown } = useAdminHiderStore();

  // Delete Modal Component hider.
  const { setDeletePostModalShown } = useDeletePostStore();

  // Asynchronous deletion function.
  const handleConfirm = async () => {
    try {
      const response = await apiClient.delete(`${API_BASE}/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
        },
      });

      const { statusCode } = response.data;
      if (statusCode === 209) {
        toast(response.data.message, { type: "success" });
        setDeletePostModalShown(false);
        setAShown(false);
      }
    } catch (error) {
      console.error(error);
      const err = error as { message: string };

      toast(err.message, { type: "error" });
    }
  };

  // Function that will close the modal and hide the blocker.
  const handleCancel = () => {
    setDeletePostModalShown(false);
    setAShown(false);
  };

  return (
    <div className="w-56 h-32 flex flex-col justify-between p-5 bg-neutral-200 dark:bg-neutral-900 absolute">
      <p className="text-center">Delete the post?</p>
      <div className="w-full flex justify-between items-center">
        <button onClick={handleConfirm}>yes</button>
        <button onClick={handleCancel}>no</button>
      </div>
    </div>
  );
};

export default DeletePostModal;
