"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import MotionP from "@/app/components/animation/MotionP";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import { toast } from "react-toastify";
import apiClient from "@/app/http-common/apiUrl";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import Link from "next/link";
import { API_BASE } from "@/app/bindings/binding";
import { questions } from "@/app/utils/misc/questions";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import { Image } from "primereact/image";
import { Dropdown } from "primereact/dropdown";

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
  const [question, setQuestion] = useState<string>("");

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
      className="lg:w-[490px] bg-[#EEEEEE] flex justify-center shadow-lg"
    >
      {" "}
      <main className="lg:w-[490px] p-7 dark:bg-neutral-800 h-screen flex flex-col justify-between items-center">
        <header className="w-full">
          <Link href={"/welcome"} className="flex items-center gap-4">
            <Image src={wmcLogo.src} alt="wmc logo" height="45" width="45" />
            <div className="text-blue-600">
              <h4 className="font-semibold text-xl">Westlake Medical Center</h4>
            </div>
          </Link>
        </header>
        <section className="w-full lg:w-96 h-96 overflow-auto">
          <div className="flex flex-col mb-2">
            <p className="text-blue-600 text-3xl font-bold">
              Recover your password
            </p>
            <p className="font-medium">
              Enter the question and answer you picked
            </p>
          </div>
          <div className="mb-3 h-20">
            <label htmlFor="idInput" className="text-sm font-semibold">
              ID Number
            </label>
            <InputText
              id="idInput"
              {...register("employeeId", { required: "Your id is required" })}
              placeholder="Enter your ID"
              className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
            />
            {errors.employeeId && (
              <MotionP className="text-red-500 text-xs font-semibold">
                {errors.employeeId?.message}
              </MotionP>
            )}
          </div>
          <div className="h-14 mb-12 grid">
            <label htmlFor="passwordInput" className="text-sm font-semibold">
              Secret Question
            </label>
            <Dropdown
              options={questions}
              placeholder="Select a question"
              className="border border-black"
              value={question}
              onChange={(e) => {
                setQuestion(e.value);
                setValue("secretQuestion1", e.value);
              }}
            />
            {errors.employeeId && (
              <MotionP className="text-red-500 font-semibold text-xs">
                Password required
              </MotionP>
            )}
          </div>
          <div className="mb-3 h-20">
            <label htmlFor="idInput" className="text-sm font-semibold">
              Your Answer
            </label>
            <InputText
              id="idInput"
              {...register("answer", { required: "Your answer is required" })}
              placeholder="Enter your ID"
              className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
            />
            {errors.answer && (
              <MotionP className="text-red-500 text-xs font-semibold">
                {errors.answer?.message}
              </MotionP>
            )}
          </div>
          <div className="h-14 mb-12">
            <label htmlFor="passwordInput" className="text-sm font-semibold">
              New Password
            </label>
            <InputText
              id="passwordInput"
              {...register("newPassword", { required: true })}
              placeholder="*********"
              type="password"
              className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
            />
            {errors.newPassword && (
              <MotionP className="text-red-500 font-semibold text-xs">
                Password required
              </MotionP>
            )}
          </div>
          <Button
            disabled={loading}
            className={`${
              loading && "opacity-80"
            } bg-blue-600 h-12 w-full justify-center font-bold text-white mb-2`}
          >
            {loading && (
              <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
            )}
            Recover Password
          </Button>{" "}
          <div className="w-full">
            <p className="dark:text-white text-center text-sm font-semibold">
              Remembered your password?{" "}
              <Link href={"login"}>
                <span className="hover:underline text-blue-700 dark:text-blue-500 cursor-pointer">
                  Go back
                </span>
              </Link>
            </p>
          </div>
        </section>
        <footer className="w-96">
          <hr className="border-b/0 border-black w-full mb-2" />
          <p className="text-xs font-medium">
            Copyright 2025 All Rights Reserved
          </p>
          <p className="text-xs font-bold text-blue-600">
            Westlake Medical Center
          </p>
        </footer>
      </main>
    </form>
  );
};

export default ForgotPasswordForm;
