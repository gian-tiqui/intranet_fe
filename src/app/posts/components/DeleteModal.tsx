import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface Props {
  postId?: number;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
}

const DeleteModal: React.FC<Props> = ({ postId, setShowDeleteModal }) => {
  const router = useRouter();
  const confirmDelete = async () => {
    if (postId) {
      try {
        const response = await apiClient.delete(`${API_BASE}/post/${postId}`);

        const data = response.data;

        console.log(data);
        toast("Post deleted successfully", { type: "success" });

        router.push("/posts");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="w-52 flex flex-col text-black dark:text-white absolute bg-neutral-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-700 rounded-2xl p-4 transform translate-x-[100%] translate-y-[50%]">
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
