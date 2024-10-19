import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import commentIdStore from "@/app/store/commentId";
import showDeleteCommentModalStore from "@/app/store/deleteComment";
import useSetCommentsStore from "@/app/store/useCommentsStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import React from "react";
import { toast } from "react-toastify";

const DeleteCommentPopup = () => {
  const { setShowDeleteComment } = showDeleteCommentModalStore();
  const { commentId } = commentIdStore();
  const { setComments, comments } = useSetCommentsStore();

  const handleCommentDelete = async () => {
    try {
      const response = await apiClient.delete(
        `${API_BASE}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      if (response.data.statusCode === 209) {
        toast(response.data.message, {
          type: "success",
          className: toastClass,
        });

        setShowDeleteComment(false);

        const cid = response.data.deletedComment.cid;

        const updatedComments = comments.filter(
          (comment) => comment.cid !== cid
        );

        setComments(updatedComments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={() => setShowDeleteComment(false)}
      className="absolute z-50 grid place-content-center w-full h-full bg-black bg-opacity-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-56 bg-white dark:bg-neutral-900 rounded-2xl pt-5 shadow"
      >
        <p className="text-center font-bold text-lg mb-10 mx-5">
          Delete this comment?
        </p>
        <div className="flex w-full justify-between font-bold">
          <button
            onClick={handleCommentDelete}
            className="rounded-es-2xl w-full border-t border-e border-b h-9 bg-inherit hover:bg-gray-200 dark:hover:bg-neutral-700 dark:border-neutral-700"
          >
            Yes
          </button>
          <button
            onClick={() => setShowDeleteComment(false)}
            className="rounded-ee-2xl w-full border h-9 bg-inherit hover:bg-gray-200 dark:hover:bg-neutral-700 dark:border-neutral-700"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCommentPopup;
