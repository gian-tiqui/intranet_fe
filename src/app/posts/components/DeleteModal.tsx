import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import usePostIdStore from "@/app/store/postId";
import useSignalStore from "@/app/store/signalStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  setShowDeleteModal: (showDeleteModal: boolean) => void;
}

const DeleteModal: React.FC<Props> = ({ setShowDeleteModal }) => {
  const router = useRouter();
  const { setSignal } = useSignalStore();

  const { postId } = usePostIdStore();
  const confirmDelete = async () => {
    if (postId) {
      try {
        const response = await apiClient.delete(`${API_BASE}/post/${postId}`);

        const data = response.data;

        toast(data.message, {
          type: "success",
          className: toastClass,
        });

        setSignal(true);
        setShowDeleteModal(false);

        router.push("/bulletin");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-52 z-50 flex flex-col text-black dark:text-white bg-neutral-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-2xl p-4">
      <p className="text-red-600 dark:text-red-500 font-bold mb-10">
        Are you sure that you want to delete this post?
      </p>
      <button
        onClick={confirmDelete}
        className="rounded-lg h-8 font-semibold bg-red-600 hover:bg-red-700 dark:hover:bg-red-600 dark:bg-red-500 w-full mb-2"
      >
        Yes
      </button>
      <button
        onClick={() => setShowDeleteModal(false)}
        className="bg-neutral-200 font-semibold hover:bg-gray-300 dark:hover:bg-neutral-700 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg h-8 w-full"
      >
        No
      </button>
    </div>
  );
};

export default DeleteModal;
