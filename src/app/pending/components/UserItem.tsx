import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import { User } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  pendingUser: User;
  onRefetch: () => void;
}

const UserItem: React.FC<Props> = ({ pendingUser, onRefetch }) => {
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

  return (
    <div className="w-full h-10 bg-gray-100 dark:bg-neutral-800 shadow flex items-center px-3 rounded justify-between">
      <div className="w-full flex gap-2">
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
          className="h-6 w-6 cursor-pointer rounded bg-green-500 p-1"
        />
        <Icon
          icon={"iconoir:cancel"}
          className="h-6 w-6 cursor-pointer  rounded bg-red-500 p-1"
        />
      </div>
    </div>
  );
};

export default UserItem;