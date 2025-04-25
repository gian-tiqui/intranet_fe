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
      <div className="flex items-center gap-4">
        <Image src={wmcLogo.src} alt="wmc logo" height="45" width="45" />
        <div className="text-blue-600">
          <h4 className="font-semibold text-xl">Westlake</h4>
          <h6 className="text-xs font-semibold">Medical Center</h6>
        </div>
      </div>
      <div className="flex items-center text-lg gap-7 font-semibold text-blue-600">
        <Link href={""}>Home</Link>
        <Link href={""}>About</Link>
        <Link href={""}>FAQS</Link>
        <Link href={""}>Login</Link>
        <Link
          href={""}
          className="h-10 rounded-full w-10 grid place-content-center bg-blue-600"
        >
          <i className={`${PrimeIcons.USER} text-lg text-white`}></i>
        </Link>
      </div>
    </nav>
  );
};

export default WelcomeNavbar;
