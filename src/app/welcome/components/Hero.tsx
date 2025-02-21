import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <>
      <div className="grid h-screen gap-4 md:gap-3 text-4xl md:text-3xl text-center place-content-center pt-20 bg-gradient-to-b from-neutral-50 via-neutral-200 to-neutral-300 dark:from-neutral-950 dark:via-neutral-800 dark:to-neutral-700">
        <p className="text-3xl mb-3 font-mono">Introducing Intranet</p>
        <p className="font-semibold text-6xl">Your one stop kiosk</p>
        <Link href={"#description"}>
          <button className="mx-auto text-xl mt-10 font-bold flex items-center justify-center gap-2 w-52 py-2 border bg-black text-white border-black hover:bg-neutral-800 rounded-xl">
            <Icon
              icon={"majesticons:rocket-3-start-line"}
              className="h-6 w-6"
            />
            Explore
          </button>
        </Link>
      </div>
    </>
  );
};

export default Hero;
