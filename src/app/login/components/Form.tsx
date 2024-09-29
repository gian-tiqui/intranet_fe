"use client";
import Cookies from "js-cookie";

import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";

type FormFields = {
  email: string;
  password: string;
};

const Form = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const account = {
    email: "user@wmc.com",
    password: "password",
  };

  useEffect(() => {
    if (Cookies.get("intranet") && localStorage.getItem("intranet")) {
      setHidden(false);
      router.push("/");
    }
  }, [setHidden, router]);

  const handleLogin = (data: FormFields) => {
    if (data.email !== account.email && data.password !== account.password)
      return;

    setHidden(true);
    Cookies.set("intranet", "1");
    localStorage.setItem("intranet", "1");
    router.push("/post");
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="p-6 w-80 bg-white dark:bg-neutral-900 rounded-2xl shadow"
    >
      <h1 className="text-xl mb-2 text-center font-bold">Login</h1>
      <h1 className="mb-20 text-center font-semibold">
        Sign in to your account
      </h1>

      <div className="mb-3 h-14">
        <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl mb-1">
          <Icon
            className="h-6 w-6 text-neutral-400"
            icon={"ic:outline-email"}
          />
          <input
            className="bg-neutral-100 dark:bg-neutral-800 outline-none w-full"
            {...register("email", { required: true })}
            placeholder="Email"
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs ms-4 font-bold">Email required</p>
        )}
      </div>
      <div className="h-14 mb-14">
        <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl mb-1">
          <Icon
            className="h-6 w-6 text-neutral-400"
            icon={"mdi:password-outline"}
          />
          <input
            className="bg-neutral-100 dark:bg-neutral-800 outline-none w-full"
            {...register("password", { required: true })}
            placeholder="Password"
            type="password"
          />
        </div>
        {errors.password && (
          <p className="text-red-500 ms-4 font-bold text-xs">
            Password required
          </p>
        )}
      </div>

      <div className="w-full flex flex-col items-center">
        <button className="w-48 mb-1 rounded-2xl h-10 text-neutral-200 border border-neutral-300 font-bold bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-800 hover:bg-neutral-900">
          Login
        </button>
        <p className="text-center text-xs text-red-500 font-semibold hover:text-red-600 cursor-pointer">
          Forgot password?
        </p>
      </div>
    </form>
  );
};

export default Form;
