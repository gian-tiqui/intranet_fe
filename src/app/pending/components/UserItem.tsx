import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import useSignalStore from "@/app/store/signalStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { User } from "@/app/types/types";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  pendingUser: User;
  onRefetch: () => void;
}

const UserItem: React.FC<Props> = ({ pendingUser, onRefetch }) => {
  const { setSignal } = useSignalStore();

  const handleConfirm = async () => {
    try {
      const response = await apiClient.put(
        `${API_BASE}/users/${Number(pendingUser.id)}`,
        { confirmed: true }
      );

      if (response.data.statusCode === 200) {
        toast(response.data.message, {
          type: "success",
          className: "bg-neutral-200 dark:bg-neutral-900",
        });

        setSignal(true);
        onRefetch();
      }
    } catch (error) {
      const { message } = error as { message: string };

      toast(message, {
        type: "error",
        className: "bg-neutral-200 dark:bg-neutral-900",
      });
    }
  };

  const handleDecline = async () => {
    try {
      const response = await apiClient.delete(
        `${API_BASE}/users/${pendingUser.id}`
      );

      if (response.status === 200) {
        toast("User activation declined", {
          type: "success",
          className: toastClass,
        });

        onRefetch();
        setSignal(true);
      }
    } catch (error) {
      console.error("There was a problem declining the user activation", error);
    }
  };

  return (
    <div className="w-full h-36 bg-gray-100 cursor-default dark:bg-neutral-700 flex flex-col shadow p-3 rounded justify-between">
      <div className="w-full flex items-center gap-2">
        <div className="rounded-full h-10 w-10 bg-blue-500 grid place-content-center font-extrabold text-lg">
          {pendingUser.firstName[0].toUpperCase() +
            pendingUser.lastName[0].toLowerCase()}
        </div>
        <p className="font-medium">{pendingUser.firstName}</p>
        {pendingUser.middleName && pendingUser.middleName !== "" && (
          <p className="font-medium">{pendingUser?.middleName[0]}.</p>
        )}
        <p className="font-medium">{pendingUser.lastName}</p>
      </div>
      <div className="flex gap-2 w-full justify-end">
        <button
          className="bg-green-400 rounded h-8 font-medium w-20"
          onClick={handleConfirm}
        >
          Approve
        </button>
        <button
          className="bg-red-400 rounded h-8 font-medium w-20"
          onClick={handleDecline}
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default UserItem;
