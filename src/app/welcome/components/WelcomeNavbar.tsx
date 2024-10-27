import Link from "next/link";
import React from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";

const WelcomeNavbar = () => {
  return (
    <nav className="w-full h-20 py-3 px-10 flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Image
          src={wmcLogo}
          width={1000}
          height={1000}
          className="h-9 w-auto"
          alt="Westlake Med"
        />
        <div>
          <p className="font-extrabold">Intranet</p>
          <p className="text-xs">Westlake Medical Center</p>
        </div>
      </div>
      <Link
        href={"/login"}
        className="flex justify-center items-center gap-1 rounded-full px-4 py-1 border-2 border-black"
      >
        <Icon icon={"mdi:user"} className="h-5 w-5" />
        <p className="font-semibold text-sm">Login</p>
      </Link>
    </nav>
  );
};

export default WelcomeNavbar;
