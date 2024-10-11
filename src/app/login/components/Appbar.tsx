"use client";
import ModeToggler from "@/app/components/ModeToggler";
import React from "react";
import Intranet from "./Intranet";
import Navlinks from "./Navlinks";
import { motion } from "framer-motion";

const Appbar = () => {
  return (
    <div className="w-full justify-between flex px-6 sm:h-24 items-center border-b border-black dark:border-gray-100">
      <div className="w-full">
        <Intranet />
      </div>

      <Navlinks />
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
          delay: 0.3,
        }}
        className="w-full flex justify-end"
      >
        <ModeToggler />
      </motion.div>
    </div>
  );
};

export default Appbar;
