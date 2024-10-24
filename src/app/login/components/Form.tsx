"use client";
import Cookies from "js-cookie";
import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import MotionP from "@/app/components/animation/MotionP";
import useSplashToggler from "@/app/store/useSplashStore";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import { toast } from "react-toastify";
import { INTRANET, API_BASE } from "@/app/bindings/binding";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/app/http-common/apiUrl";
import { motion } from "framer-motion";
import EaseString from "./EaseString";
import { toastClass } from "@/app/tailwind-classes/tw_classes";

type FormFields = {
  employeeId: number;
  password: string;
};

const Form = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { setShowSplash } = useSplashToggler();
  const { showLogoutArt, setShowLogoutArt } = useLogoutArtStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLogoutArt(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [showLogoutArt, setShowLogoutArt]);

  useEffect(() => {
    if (Cookies.get(INTRANET) && localStorage.getItem(INTRANET)) {
      setHidden(false);
      router.push("/");
    }
  }, [setHidden, router]);

  const handleLogin = async ({ employeeId, password }: FormFields) => {
    try {
      setLoading(true);
      const response = await apiClient.post(`${API_BASE}/auth/login`, {
        employeeId,
        password,
      });

      toast.dismiss();

      setHidden(true);
      const rt = response.data.tokens.refreshToken;
      const decodedToken = jwtDecode<{ exp?: number }>(rt);

      const expiresInSeconds = decodedToken.exp
        ? decodedToken.exp - Math.floor(Date.now() / 1000)
        : 0;
      const expirationDays = Math.max(
        Math.floor(expiresInSeconds / (24 * 60 * 60)),
        1
      );

      Cookies.set(INTRANET, rt, { expires: expirationDays });
      localStorage.setItem(INTRANET, response.data.tokens.accessToken);
      setShowSplash(true);

      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      if (typeof error === "object" && error !== null) {
        toast("Theres a problem with your ID or password", {
          type: "error",
          className: toastClass,
        });
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }

    return;
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="bg-white bg-opacity-50 p-6 max-w-96 w-96 border-0 flex flex-col justify-center relative h-screen border-neutral-300 dark:bg-neutral-900 dark:bg-opacity-50 shadow dark:border-black"
    >
      <div className="flex flex-col items-center">
        <div className="flex gap-1 mb-3">
          {"Welcome back!".split(" ").map((word, index) => (
            <EaseString size="" word={word} key={index} />
          ))}
        </div>
        <div className="flex gap-1 mb-16">
          {"Sign in to your account".split(" ").map((word, index) => (
            <EaseString size="" word={word} key={index} />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.7 }}
        className="mb-3 h-14"
      >
        <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-2xl mb-1">
          <Icon
            className="h-6 w-6 text-neutral-400"
            icon={"teenyicons:id-outline"}
          />
          <input
            className="bg-neutral-100 dark:bg-neutral-800 outline-none w-full"
            {...register("employeeId", { required: true })}
            placeholder="Enter your ID"
          />
        </div>
        {errors.employeeId && (
          <MotionP className="text-red-500 text-xs ms-4 font-bold">
            {errors.employeeId?.message}
          </MotionP>
        )}
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.7 }}
        className="h-14 mb-14"
      >
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
          <MotionP className="text-red-500 ms-4 font-bold text-xs">
            Password required
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
          } mb-2 rounded-2xl justify-center flex gap-2 items-center h-10 text-neutral-200 border border-neutral-900 dark:border-neutral-300 font-bold bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-800 hover:bg-neutral-900`}
        >
          {loading && (
            <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
          )}
          Login
        </motion.button>
      </div>
    </form>
  );
};

export default Form;
