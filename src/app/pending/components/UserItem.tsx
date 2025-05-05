import { API_BASE } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import useSignalStore from "@/app/store/signalStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { User } from "@/app/types/types";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import React from "react";
import { toast } from "react-toastify";

interface Props {
  pendingUser: User;
  index: number;
  onRefetch: () => void;
}

const UserItem: React.FC<Props> = ({ pendingUser, onRefetch, index }) => {
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
    <div
      className={`w-full flex items-center ${
        index !== 0 && "border-t"
      } border-gray-300`}
    >
      <div className="w-full flex items-center gap-4 text-xl ps-5 py-5">
        <Avatar
          shape="circle"
          className="bg-blue-600 h-12 w-12 text-white font-bold text-xl"
          label={
            pendingUser.firstName[0].toUpperCase() +
            pendingUser.lastName[0].toLowerCase()
          }
        />
        <div className="flex gap-2 text-lg font-semibold">
          <p>{pendingUser.firstName}</p>
          {pendingUser.middleName && pendingUser.middleName !== "" && (
            <p>{pendingUser?.middleName[0]}.</p>
          )}
          <p>{pendingUser.lastName}</p>
        </div>
      </div>
      <div className="flex gap-4 w-full justify-end pe-5">
        <Button
          onClick={handleConfirm}
          className="rounded-full h-10 w-10 bg-[#CBD5E1] text-blue-600"
          icon={`${PrimeIcons.CHECK}`}
        ></Button>
        <Button
          onClick={handleDecline}
          className="rounded-full h-10 w-10 bg-[#CBD5E1] text-blue-600"
          icon={`${PrimeIcons.TIMES}`}
        ></Button>
      </div>
    </div>
  );
};

export default UserItem;
