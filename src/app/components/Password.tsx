import React from "react";
import { useForm } from "react-hook-form";

interface FormFields {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const Password = () => {
  const { register, handleSubmit } = useForm<FormFields>();

  const onPasswordReset = (data: FormFields) => {
    console.log(data);
  };

  return (
    <form
      className="flex flex-col gap-3"
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