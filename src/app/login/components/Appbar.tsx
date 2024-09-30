import ModeToggler from "@/app/components/ModeToggler";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Appbar = () => {
  return (
    <div className="gap-10 md:w-[500px] h-14 bg-white dark:bg-neutral-900 shadow border dark:border-neutral-800 rounded-2xl mt-10 mb-8 flex justify-between px-5 items-center">
      <div className="">
        <Icon icon={"ph:hospital"} className="h-8 w-8" />
      </div>

      <div className="w-full">
        <h1 className="text-center font-mono font-bold text-2xl">INTRANET</h1>
      </div>

      <div className="">
        <ModeToggler />
      </div>
    </div>
  );
};

export default Appbar;
