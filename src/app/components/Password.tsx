import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { toastClass } from "../tailwind-classes/tw_classes";

interface FormFields {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Password = () => {
  const { register, handleSubmit, reset } = useForm<FormFields>();

  const onPasswordReset = async (data: FormFields) => {
    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        const response = await apiClient.post(
          `${API_BASE}/users/password`,
          {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
            userId: userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          toast(response.data.message, {
            className: toastClass,
            type: "success",
          });
          reset();
        }
      } catch (error) {
        const { message } = error as { message: string };

        toast(message, { type: "error" });
      }
    }
  };

  return (
    <form
      className="flex w-72 mx-auto md:w-96 flex-col gap-4 p-4 border rounded-md shadow-md bg-white dark:bg-neutral-900 dark:border-black"
      onSubmit={handleSubmit(onPasswordReset)}
    >
      <h2 className="text-xl font-semibold text-center">Change Password</h2>

      <div className="flex flex-col">
        <label htmlFor="currentPassword" className="text-sm font-medium">
          Current Password
        </label>
        <input
          type="password"
          id="currentPassword"
          placeholder="Enter current password"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          {...register("currentPassword", { required: true })}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="newPassword" className="text-sm font-medium">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          placeholder="Enter new password"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          {...register("newPassword", { required: true })}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="confirmNewPassword" className="text-sm font-medium">
          Confirm New Password
        </label>
        <input
          type="password"
          id="confirmNewPassword"
          placeholder="Re-enter new password"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none"
          {...register("confirmNewPassword", { required: true })}
        />
      </div>

      <button
        type="submit"
        className="p-2 bg-neutral-900 text-white font-medium rounded-md hover:bg-neutral-800 transition dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        Save Password
      </button>
    </form>
  );
};

export default Password;
