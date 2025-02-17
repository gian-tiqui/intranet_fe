"use client";
import { API_BASE } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useUserStore from "@/app/store/userStore";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { User } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  user: User;
}

interface FormFields {
  password: string;
}

const DeactivateUser: React.FC<Props> = ({ user }) => {
  const { setUser } = useUserStore();
  const { register, handleSubmit } = useForm<FormFields>();

  const handleFormSubmit = async (data: FormFields) => {
    const deactivatorId = decodeUserData()?.sub;

    try {
      const response = await apiClient.post(
        `${API_BASE}/users/deactivate?password=${data.password}&deactivatorId=${deactivatorId}&employeeId=${user.employeeId}`
      );

      if (response.status === 201) {
        toast(response.data.message, {
          type: "success",
          className: toastClass,
        });
        setUser(null);
      }
    } catch (error) {
      const {
        response: {
          data: { message },
        },
      } = error as { response: { data: { message: string } } };
      toast(message, { className: toastClass, type: "error" });
    }
  };

  return (
    <div
      onClick={() => setUser(null)}
      className="absolute z-50 w-full h-screen bg-black/80 grid place-content-center"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="w-80 bg-white flex flex-col justify-between h-72 dark:bg-black p-3 rounded shadow items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-1">
          <Icon icon={"solar:danger-triangle-linear"} className="h-8 w-8" />
          <p className="text-center font-bold text-red-600">
            Deactivate the account of {user.firstName} {user.lastName}?
          </p>{" "}
        </div>

        <div className="flex gap-1 items-center">
          <Icon icon={"material-symbols:info-outline"} />
          <p className="text-sm">Enter your password for confirmation</p>
        </div>
        <div className="w-full bg-neutral-200 h-11 rounded flex gap-2 items-center px-3">
          <Icon icon={"material-symbols:lock-outline"} className="h-6 w-6" />
          <input
            {...register("password", { required: true })}
            placeholder="Enter your password"
            type="password"
            className="bg-inherit outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full h-11 bg-neutral-950 dark:bg-white text-white dark:text-black font-bold rounded"
        >
          Confirm
        </button>
      </form>
    </div>
  );
};

export default DeactivateUser;
