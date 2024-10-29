"use client";
import React from "react";
import { motion } from "framer-motion";
import useSidebarStore from "@/app/store/sidebarStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import ModeToggler from "@/app/components/ModeToggler";

const WelcomeSidebar = () => {
  const { sidebarShown, setSidebarShown } = useSidebarStore();

  if (!sidebarShown) return null;

  return (
    <motion.div className="absolute w-full h-screen flex flex-col text-black dark:text-white justify-between bg-white dark:bg-neutral-700 z-50 p-6">
      <div>
        <div className="flex w-full justify-end gap-4">
          <div
            onClick={() => setSidebarShown(false)}
            className="bg-neutral-200 h-14 w-14 rounded-full grid place-content-center dark:bg-neutral-900"
          >
            <Icon icon={"iconamoon:exit"} className="h-8 w-8" />
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-5 px-14">
          <h1 className="text-xl mt-5 text-gray-400">Navigation</h1>
          <hr className="border-b-0 dark:border-gray-400 w-full" />
          <Link href={""} className="text-4xl font-bold mt-4">
            About
          </Link>
          <Link href={""} className="text-4xl font-bold">
            Kiosk
          </Link>
          <Link href={""} className="text-4xl font-bold">
            Company
          </Link>
        </div>
      </div>

      <footer className="w-full flex justify-end">
        <ModeToggler size={10} />
      </footer>
    </motion.div>
  );
};

export default WelcomeSidebar;
