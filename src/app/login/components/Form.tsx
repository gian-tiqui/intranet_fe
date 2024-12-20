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
import Link from "next/link";

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

      const accessToken: { confirmed: boolean } = jwtDecode(
        response.data.tokens.accessToken
      );

      if (accessToken.confirmed === false) {
        toast("Please wait for your account to be activated", {
          className: toastClass,
          type: "info",
        });

        return;
      }

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
      className="p-6 border-0 text-black dark:text-white flex flex-col justify-center items-center relative h-screen"
    >
      <div className="lg:w-96 shadow p-7 rounded-2xl bg-white dark:bg-neutral-900">
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
          <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border dark:border-black rounded-lg mb-1">
            <Icon
              className="h-6 w-6 text-neutral-400"
              icon={"teenyicons:id-outline"}
            />
            <input
              className="bg-inherit outline-none w-full"
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
          <div className="flex w-full gap-2 items-center px-4 h-10 bg-neutral-100 dark:bg-neutral-800 border dark:border-black rounded-lg mb-1">
            <Icon
              className="h-6 w-6 text-neutral-400"
              icon={"mdi:password-outline"}
            />
            <input
              className="bg-inherit outline-none w-full"
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
            } mb-2 rounded-lg justify-center flex gap-2 items-center h-10 font-bold bg-neutral-900 dark:bg-neutral-200 dark:text-black text-white hover:bg-neutral-900`}
          >
            {loading && (
              <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
            )}
            Login
          </motion.button>{" "}
          <hr className="border-b/0 w-[96%] mt-2 mb-4" />
          <motion.button
            type="button"
            onClick={() => router.push("/activate")}
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            disabled={loading}
            transition={{ duration: 1, delay: 0.7 }}
            className={`${
              loading && "opacity-80"
            } mb-2 rounded-lg justify-center flex gap-2 items-center h-10 font-bold dark:bg-neutral-900 border dark:border-white border-black bg-white text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800`}
          >
            {loading && (
              <Icon icon={"line-md:loading-loop"} className="h-6 w-6" />
            )}
            Activate
          </motion.button>{" "}
          <div className="w-full">
            <p className="dark:text-white text-end text-xs">
              Forgot password?{" "}
              <Link href={"forgot-password"}>
                <span className="hover:underline text-blue-700 dark:text-blue-500 cursor-pointer">
                  Click me
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end px-3">
        <Link href={"/welcome"} className="">
          <p className="text-white text-sm mt-3  hover:underline">Go back</p>
        </Link>
      </div>
    </form>
  );
};

export default Form;
