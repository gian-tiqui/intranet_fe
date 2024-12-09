"use client";
import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import deleteFolderStore from "@/app/store/deleteFolder";
import useFolderIdStore from "@/app/store/folderIdStore";
import useSignalStore from "@/app/store/signalStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import React from "react";
import { toast } from "react-toastify";

const DeleteFolderModal = () => {
  const { setShowDeleteFolderModal } = deleteFolderStore();
  const { folderId } = useFolderIdStore();
  const { setSignal } = useSignalStore();

  const handleDeleteFolder = async () => {
    if (!folderId) {
      return;
    }

    try {
      const response = await apiClient.delete(
        `${API_BASE}/folders/${folderId}`
      );

      if (response.status === 200) {
        toast("Folder deleted successfully", {
          className: toastClass,
          type: "success",
        });

        setSignal(true);
      }

      setShowDeleteFolderModal(false);
    } catch (error) {
      console.error(error);
      toast("There was a problem in deleting the folder", {
        className: toastClass,
        type: "error",
      });
    }
  };

  return (
    <div
      onClick={() => setShowDeleteFolderModal(false)}
      className="absolute w-full h-screen grid place-content-center bg-neutral-950/80 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-28 w-52 bg-white rounded shadow dark:bg-neutral-950"
      >
        <div className="w-full flex text-center flex-col pt-7 h-full justify-between">
          <h1 className="font-bold">Delete this folder?</h1>
          <div className="flex h-8">
            <div
              className="cursor-pointer grid place-content-center w-full border dark:border-neutral-700 rounded-es hover:bg-neutral-200 dark:hover:bg-neutral-700"
              onClick={handleDeleteFolder}
            >
              Yes
            </div>
            <div
              className="cursor-pointer grid place-content-center w-full border dark:border-neutral-700 rounded-ee hover:bg-neutral-200 dark:hover:bg-neutral-700"
              onClick={() => setShowDeleteFolderModal(false)}
            >
              No
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal;
