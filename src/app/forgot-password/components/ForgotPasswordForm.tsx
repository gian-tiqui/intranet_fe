"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import MotionP from "@/app/components/animation/MotionP";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import { toast } from "react-toastify";
import apiClient from "@/app/http-common/apiUrl";
import { motion } from "framer-motion";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import Link from "next/link";
import { API_BASE } from "@/app/bindings/binding";
import EaseString from "@/app/login/components/EaseString";
import { questions } from "@/app/utils/misc/questions";

type FormFields = {
  employeeId: number;
  answer: string;
  newPassword: string;
  secretQuestion1: string;
};

const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { showLogoutArt, setShowLogoutArt } = useLogoutArtStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormFields>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLogoutArt(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showLogoutArt, setShowLogoutArt]);

  const handleForgotPassword = async ({
    employeeId,
    answer,
    newPassword,
    secretQuestion1,
  }: FormFields) => {
    try {
      setLoading(true);

      const response = await apiClient.post(
        `${API_BASE}/auth/forgot-password?employeeId=${employeeId}&answer=${answer}&newPassword=${newPassword}&secretQuestion1=${secretQuestion1}`
      );

      if (response.status === 201) {
        toast("Password reset successfully", {
          className: toastClass,
          type: "success",
        });
      }
    } catch (error: unknown) {
      const {
        response: {
          data: { message },
        },
      } = error as {
        response: { data: { message: string } };
      };
      if (typeof error === "object" && error !== null) {
        toast(message, {
          type: "error",
          className: toastClass,
        });
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleForgotPassword)}
      className="p-6 border-0 text-black dark:text-white flex flex-col justify-center items-center relative h-screen"
    >
      <div className="lg:w-96 shadow p-7 rounded-2xl bg-white dark:bg-neutral-900">
        <div className="flex flex-col items-center">
          <div className="flex gap-1 mb-3">
            {"Hello there!".split(" ").map((word, index) => (
              <EaseString size="" word={word} key={index} />
            ))}
          </div>
          <div className="flex gap-1 mb-16">
            {"Recover your account here".split(" ").map((word, index) => (
              <EaseString size="" word={word} key={index} />
            ))}
          </div>
        </div>

        {/* Employee ID */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-3 h-14"
        >
          <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border dark:border-black rounded-lg mb-1">
            <Icon
              className="h-6 w-6 text-neutral-400"
              icon={"teenyicons:id-outline"}
            />
            <input
              className="bg-inherit outline-none w-full"
              {...register("employeeId", {
                required: "Employee ID is required",
              })}
              placeholder="Enter your Employee ID"
            />
          </div>

          {errors.employeeId && (
            <MotionP className="text-red-500 text-xs ms-4 font-bold">
              {errors.employeeId?.message}
            </MotionP>
          )}
        </motion.div>

        <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border dark:border-black rounded-lg mb-6">
          <select
            onChange={(e) => setValue("secretQuestion1", e.target.value)}
            id="question"
            className="mt-1 p-2 rounded-md bg-inherit w-72 outline-none"
          >
            {questions.map((question: string, index) => (
              <option className="dark:bg-black" value={question} key={index}>
                {question}
              </option>
            ))}
          </select>
        </div>

        {/* Secret Answer */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-3 h-14"
        >
          <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border dark:border-black rounded-lg mb-1">
            <Icon
              className="h-6 w-6 text-neutral-400"
              icon={"mdi:question-mark-circle-outline"}
            />
            <input
              type="text"
              className="bg-inherit outline-none w-full"
              {...register("answer", { required: "Answer is required" })}
              placeholder="Enter your secret answer"
            />
          </div>
          {errors.answer && (
            <MotionP className="text-red-500 text-xs ms-4 font-bold">
              {errors.answer?.message}
            </MotionP>
          )}
        </motion.div>

        {/* New Password */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mb-3 h-14"
        >
          <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border dark:border-black rounded-lg mb-1">
            <Icon
              className="h-6 w-6 text-neutral-400"
              icon={"mdi:lock-outline"}
            />
            <input
              type="password"
              className="bg-inherit outline-none w-full"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter your new password"
            />
          </div>
          {errors.newPassword && (
            <MotionP className="text-red-500 text-xs ms-4 font-bold">
              {errors.newPassword?.message}
            </MotionP>
          )}
        </motion.div>

        <div className="flex flex-col items-center">
          <motion.button
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            disabled={loading}
            transition={{ duration: 1, delay: 0.7 }}
            className={`${
              loading && "opacity-80"
            } mb-2 rounded-lg justify-center flex gap-2 items-center h-10 font-bold bg-neutral-900 dark:bg-neutral-200 dark:text-black text-white hover:bg-neutral-900`}
          >
            {loading && (
              <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
            )}
            Reset Password
          </motion.button>{" "}
          <div className="w-full">
            <p className="dark:text-white text-end text-xs">
              Want to go back?{" "}
              <Link href={"login"}>
                <span className="hover:underline text-blue-700 dark:text-blue-500 cursor-pointer">
                  Click me
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
