"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import { INTRANET } from "@/app/bindings/binding";
import Cookies from "js-cookie";
import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import { PrimeIcons } from "primereact/api";
import { Image } from "primereact/image";
import { motion } from "motion/react";

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
    <nav className="w-full items-center px-6 flex h-20 justify-between">
      <motion.div
        initial={{ opacity: 0, x: -70 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.9, duration: 1.5 }}
        className="flex items-center gap-4"
      >
        <Image src={wmcLogo.src} alt="wmc logo" height="45" width="45" />
        <div className="text-blue-600">
          <h4 className="font-bold text-3xl">Westlake Medical Center</h4>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.7, duration: 0.7 }}
        className="flex items-center text-lg gap-7 text-blue-600"
      >
        <Link href={"welcome"}>Home</Link>
        <Link href={"faqs"}>FAQS</Link>
        <Link href={"login"}>Login</Link>
        <Link
          href={""}
          className="h-10 rounded-full w-10 grid place-content-center bg-blue-600"
        >
          <i className={`${PrimeIcons.USER} text-lg text-white`}></i>
        </Link>
      </motion.div>
    </nav>
  );
};

export default WelcomeNavbar;
