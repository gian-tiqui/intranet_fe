import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import useOpenCreateFolderMainStore from "@/app/store/createMainFolder";
import useSignalStore from "@/app/store/signalStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormFields {
  name: string;
}

const MainFolderModal = () => {
  const { setOpenCreateFolderModal } = useOpenCreateFolderMainStore();
  const { setSignal } = useSignalStore();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormFields>();

  const handleFormSubmit = async (data: FormFields) => {
    const response = await apiClient.post(`${API_BASE}/folders`, {
      name: data.name,
    });

    setSignal(true);

    if (response.status === 201) {
      toast("Folder created successfully", {
        className: toastClass,
        type: "success",
      });

      setOpenCreateFolderModal(false);
    }
  };

  return (
    <div
      className="absolute w-full h-screen grid place-content-center bg-neutral-950/80 z-50"
      onClick={() => setOpenCreateFolderModal(false)}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="p-3 h-44 w-64 bg-white dark:bg-neutral-900 rounded flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-bold text-center">Create new folder</h1>
        <div className="mb-3">
          <input
            {...register("name", { required: true })}
            placeholder="Enter folder name"
            className="bg-neutral-200 rounded px-2 w-full h-8 dark:bg-neutral-800"
          />
          {errors.name && (
            <p className="text-xs text-red-600">Folder name required</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded h-8 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default MainFolderModal;
