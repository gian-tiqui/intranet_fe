"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { INTRANET } from "@/app/bindings/binding";
import Cookies from "js-cookie";
import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import ModeToggler from "@/app/components/ModeToggler";

const WelcomeNavbar = () => {
  const router = useRouter();
  const { setHidden } = useNavbarVisibilityStore();

  useEffect(() => {
    if (Cookies.get(INTRANET) && localStorage.getItem(INTRANET)) {
      setHidden(false);
      router.push("/");
    }
  }, [setHidden, router]);

  return (
    <>
      <nav className="w-full flex bg-white/70 dark:bg-neutral-900 backdrop-blur-3xl justify-between border-b dark:border-neutral-800 shadow  p-4 fixed top-0">
        <div className="flex gap-2 items-center cursor-default">
          <Image
            src={wmcLogo}
            width={1000}
            height={1000}
            className="h-7 md:h-9 w-auto"
            alt="Westlake Medical Center"
          />
          <div>
            <p className="font-extrabold sm:text-lg">WMC Employee Portal</p>
            <p className="text-[10px] sm:text-xs">Westlake Medical Center</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <Link
            href={"/login"}
            className="hidden md:flex justify-center items-center gap-1 rounded h-11 w-32 px-4 py-1 bg-black text-white hover:bg-neutral-700 dark:bg-white dark:hover:bg-gray-100 dark:text-black "
          >
            <Icon icon={"mdi:user"} className="h-5 w-5" />
            <p className="font-semibold text-sm">Login</p>
          </Link>

          <Link href={"/login"} className="block md:hidden">
            <Icon icon={"mdi:user"} className="h-8 w-8" />
          </Link>

          <ModeToggler />
        </div>
      </nav>
    </>
  );
};

export default WelcomeNavbar;
