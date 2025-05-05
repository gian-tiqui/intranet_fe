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
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import Link from "next/link";
import axios from "axios";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import { Image } from "primereact/image";
import useLoginStore from "@/app/store/loggedInStore";

type FormFields = {
  employeeId: string;
  password: string;
};

const Form = () => {
  const { setHidden } = useNavbarVisibilityStore();
  const [loading, setLoading] = useState<boolean>(false);
  const { setShowSplash } = useSplashToggler();
  const { showLogoutArt, setShowLogoutArt } = useLogoutArtStore();
  const { setIsCollapsed } = useToggleStore();
  const router = useRouter();
  const { setIsLoggedIn } = useLoginStore();
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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

  useEffect(() => {
    const lockOutUser = async () => {
      if (wrongAttempts <= 5) return;

      const currentEmployeeId = getValues("employeeId");
      if (!currentEmployeeId) return;

      try {
        const response = await axios.post(
          `${API_BASE}/auth/${currentEmployeeId}/lock-user`
        );

        if (response.status === 201) {
          setWrongAttempts(0);
        }
      } catch (error) {
        console.error("Error locking user:", error);
      }
    };

    lockOutUser();
  }, [wrongAttempts, getValues]);

  const handleLogin = async ({ employeeId, password }: FormFields) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE}/auth/login`, {
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
      setIsLoggedIn(true);
      setShowSplash(true);
      setIsCollapsed(false);

      router.push("/");
    } catch (error: unknown) {
      console.error(error);
      if (typeof error === "object" && error !== null) {
        toast("Theres a problem with your ID or password", {
          type: "error",
          className: toastClass,
        });
        setWrongAttempts((prev) => prev + 1);
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
      className="lg:w-[490px] bg-[#EEEEEE] flex justify-center shadow-lg"
    >
      {" "}
      <main className="lg:w-[490px] p-7 dark:bg-neutral-800 h-screen flex flex-col justify-between items-center">
        <header className="w-full">
          <Link href={"/welcome"} className="flex items-center gap-4">
            <Image src={wmcLogo.src} alt="wmc logo" height="45" width="45" />
            <div className="text-blue-600">
              <h4 className="font-semibold text-xl">Westlake</h4>
              <h6 className="text-xs font-semibold">Medical Center</h6>
            </div>
          </Link>
        </header>
        <section className="w-full lg:w-96">
          <div className="flex flex-col mb-10">
            <p className="text-blue-600 text-3xl font-bold">Welcome back</p>
            <p className="font-medium">Sign in to your account</p>
          </div>
          <div className="mb-3 h-20">
            <label htmlFor="idInput" className="text-sm font-semibold">
              ID Number
            </label>
            <InputText
              id="idInput"
              {...register("employeeId", {
                required: "Employee id is required",
              })}
              placeholder="Enter your ID"
              className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
            />
            {errors.employeeId && (
              <MotionP className="text-red-500 text-xs font-semibold">
                {errors.employeeId?.message}
              </MotionP>
            )}
          </div>
          <div className="h-14 mb-12">
            <label htmlFor="passwordInput" className="text-sm font-semibold">
              Password
            </label>
            <InputText
              id="passwordInput"
              {...register("password", { required: true })}
              placeholder="*********"
              type="password"
              className="h-12 w-full px-5 text-sm bg-white border border-black mb-1"
            />
            {errors.password && (
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
            Sign in
          </Button>{" "}
          <div className="w-full">
            <p className="dark:text-white text-center text-sm font-semibold">
              Forgot password?{" "}
              <Link href={"forgot-password"}>
                <span className="hover:underline text-blue-700 dark:text-blue-500 cursor-pointer">
                  Click me
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

export default Form;
