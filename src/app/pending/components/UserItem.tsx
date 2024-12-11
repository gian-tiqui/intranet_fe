import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import useSignalStore from "@/app/store/signalStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { User } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
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
        { confirmed: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
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
    <div className="w-full h-10 bg-gray-100 cursor-default dark:bg-neutral-800 shadow flex items-center px-3 rounded justify-between">
      <div className="w-full flex items-center gap-2">
        <Icon icon={"mdi:user-outline"} className="h-7 w-7" />
        <p>{pendingUser.firstName}</p>
        {pendingUser && pendingUser.middleName !== "" && (
          <p>pendingUser.middleName[0]</p>
        )}
        <p>{pendingUser.lastName}</p>
      </div>
      <div className="flex gap-2 w-full justify-end">
        <Icon
          onClick={handleConfirm}
          icon={"line-md:confirm"}
          className="h-6 w-6 cursor-pointer rounded bg-green-500 hover:bg-green-600 p-1"
        />
        <Icon
          onClick={handleDecline}
          icon={"iconoir:cancel"}
          className="h-6 w-6 cursor-pointer  rounded bg-red-500 hover:bg-red-600 p-1"
        />
      </div>
    </div>
  );
};

export default UserItem;
