import Link from "next/link";
import React from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import ModeToggler from "@/app/components/ModeToggler";

const WelcomeNavbar = () => {
  return (
    <nav className="w-[50%] h-16 p-4 flex justify-between items-center bg-white text-black shadow-lg rounded-xl absolute left-1/2 top-4 transform -translate-x-1/2">
      <div className="flex gap-2 items-center cursor-default">
        <Image
          src={wmcLogo}
          width={1000}
          height={1000}
          className="h-9 w-auto"
          alt="Westlake Med"
        />
        <div>
          <p className="font-extrabold text-lg">Intranet</p>
          <p className="text-xs">Westlake Medical Center</p>
        </div>
      </div>
      <div className="flex gap-6  text-sm font-semibold">
        <Link href={""} className="hover:underline">
          About
        </Link>
        <Link href={""} className="hover:underline">
          Kiosk
        </Link>
        <Link href={""} className="hover:underline">
          Company
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <Link
          href={"/login"}
          className="flex justify-center items-center gap-1 rounded-lg h-9 w-32 px-4 py-1 bg-black text-white hover:bg-neutral-700"
        >
          <Icon icon={"mdi:user"} className="h-5 w-5" />
          <p className="font-semibold text-sm">Login</p>
        </Link>
        <ModeToggler size={6} />
      </div>
    </nav>
  );
};

export default WelcomeNavbar;
