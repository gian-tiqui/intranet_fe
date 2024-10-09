import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import useAdminHiderStore from "@/app/store/adminOpacitor";
import deleteUserStore from "@/app/store/deleteUserModal";
import userIdStore from "@/app/store/userId";
import React from "react";
import { toast } from "react-toastify";

const DeleteModal = () => {
  const { selectedId } = userIdStore();
  const { setAShown } = useAdminHiderStore();
  const { setShowDeleteModal } = deleteUserStore();

  const handleConfirm = async () => {
    try {
      const response = await apiClient.delete(
        `${API_BASE}/users/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      const { statusCode } = response.data;
      if (statusCode === 204) {
        toast(response.data.message, { type: "success" });
        setShowDeleteModal(false);
        setAShown(false);
      }
    } catch (error) {
      console.error(error);
      const err = error as { message: string };

      toast(err.message, { type: "error" });
    }
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
    setAShown(false);
  };

  return (
    <div className="w-56 h-32 flex flex-col justify-between p-5 bg-neutral-200 dark:bg-neutral-900 absolute">
      <p className="text-center">Delete the user?</p>
      <div className="w-full flex justify-between items-center">
        <button onClick={handleConfirm}>yes</button>
        <button onClick={handleCancel}>no</button>
      </div>
    </div>
  );
};

export default DeleteModal;
