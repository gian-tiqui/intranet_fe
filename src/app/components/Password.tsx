import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";

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
          toast(response.data.message);
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
      className="flex w-72 md:w-auto flex-col gap-3"
      onSubmit={handleSubmit(onPasswordReset)}
    >
      <h1 className="text-center font-bold mb-3">Change password</h1>
      <div className="flex justify-between items-center">
        <p>Current password</p>
        <input
          className="outline-none dark:bg-neutral-900 border-b border-neutral-700 px-2"
          type="password"
          {...register("currentPassword", { required: true })}
        />
      </div>
      <div className="flex justify-between items-center">
        <p>New password</p>
        <input
          className="outline-none dark:bg-neutral-900 border-b border-neutral-700 px-2"
          type="password"
          {...register("newPassword", { required: true })}
        />
      </div>
      <div className="flex justify-between items-center mb-5">
        <p>Confirm new password</p>
        <input
          className="outline-none dark:bg-neutral-900 border-b border-neutral-700 px-2"
          type="password"
          {...register("confirmNewPassword", { required: true })}
        />
      </div>
      <button
        type="submit"
        className="bg-neutral-200 hover:bg-neutral-100 shadow font-semibold dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-full h-10 w-52 mx-auto"
      >
        Save password
      </button>
    </form>
  );
};

export default Password;
