import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { toastClass } from "../tailwind-classes/tw_classes";
import { Button } from "primereact/button";
import MotionP from "./animation/MotionP";
import { InputText } from "primereact/inputtext";

interface FormFields {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Password = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>();

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
    <form className="w-96  mx-auto" onSubmit={handleSubmit(onPasswordReset)}>
      <div className="flex flex-col h-24">
        <label htmlFor="currentPassword" className="text-xs font-medium">
          Current Password
        </label>
        <InputText
          type="password"
          id="currentPassword"
          placeholder="********"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none bg-white mb-1 text-sm h-10 px-3 border-black"
          {...register("currentPassword", {
            required: "Current password is required",
          })}
        />
        {errors.currentPassword && (
          <MotionP className="text-xs text-red-600">
            {errors.currentPassword.message}
          </MotionP>
        )}
      </div>

      <div className="flex flex-col h-24">
        <label htmlFor="newPassword" className="text-xs font-medium">
          New Password
        </label>
        <InputText
          type="password"
          id="newPassword"
          placeholder="********"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none bg-white mb-1 text-sm h-10 px-3 border-black"
          {...register("newPassword", { required: "New password is required" })}
        />
        {errors.newPassword && (
          <MotionP className="text-xs text-red-600">
            {errors.newPassword.message}
          </MotionP>
        )}
      </div>

      <div className="flex flex-col h-24 mb-4">
        <label htmlFor="confirmNewPassword" className="text-xs font-medium">
          Confirm New Password
        </label>
        <InputText
          type="password"
          id="confirmNewPassword"
          placeholder="********"
          className="mt-1 p-2 border rounded-md bg-inherit outline-none flex bg-white mb-1 text-sm h-10 px-3 border-black"
          {...register("confirmNewPassword", {
            required: "Please enter your new password again",
          })}
        />
        {errors.confirmNewPassword && (
          <MotionP className="text-xs text-red-600">
            {errors.confirmNewPassword.message}
          </MotionP>
        )}
      </div>

      <Button
        type="submit"
        className="p-2 bg-blue-600 w-full text-white justify-center font-bold h-10"
      >
        Save Password
      </Button>
    </form>
  );
};

export default Password;
