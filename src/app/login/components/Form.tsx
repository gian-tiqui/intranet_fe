"use client";
import Cookies from "js-cookie";
import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence } from "framer-motion";
import MotionP from "@/app/components/animation/MotionP";
import useSplashToggler from "@/app/store/useSplashStore";
import useLogoutArtStore from "@/app/store/useLogoutSplashStore";
import { toast } from "react-toastify";
import { INTRANET, API_BASE } from "@/app/bindings/binding";
import { jwtDecode } from "jwt-decode";
import apiClient from "@/app/http-common/apiUrl";
import { motion } from "framer-motion";
import EaseString from "./EaseString";

type FormFields = {
  email: string;
  password: string;
};

const Form = () => {
  const { setHidden } = useNavbarVisibilityStore();
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

  const handleLogin = async ({ email, password }: FormFields) => {
    if (!email.endsWith("@wmc.com")) {
      toast("Email Invalid", {
        type: "error",
        className:
          "bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-white",
      });

      return;
    }

    try {
      const response = await apiClient.post(
        `${API_BASE ? API_BASE : "http://localhost:8080"}/auth/login`,
        {
          email,
          password,
        }
      );

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
      if (typeof error === "object" && error !== null) {
        const errorObj = error as { response: { data: { message: string } } };
        toast(errorObj.response.data.message, {
          type: "error",
          className:
            "bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-white",
        });
      } else {
        console.error("Unexpected error:", error);
      }
    }

    return;
  };

  return (
    <AnimatePresence>
      <form onSubmit={handleSubmit(handleLogin)} className="p-6 max-w-80">
        <div className="flex flex-col items-center">
          <EaseString size="" word="Login" />
          <div className="flex gap-1 mb-16">
            {"Sign in to your account".split(" ").map((word, index) => (
              <EaseString size="" word={word} key={index} />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1 }}
          className="mb-3 h-14"
        >
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
            <MotionP className="text-red-500 text-xs ms-4 font-bold">
              Email required
            </MotionP>
          )}
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1 }}
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
            transition={{ duration: 1 }}
            className="mb-2 rounded-2xl h-10 text-neutral-200 border border-neutral-300 font-bold bg-neutral-800 dark:bg-neutral-200 dark:text-neutral-800 hover:bg-neutral-900"
          >
            Login
          </motion.button>
        </div>
      </form>
    </AnimatePresence>
  );
};

export default Form;
