"use client";
import React from "react";
import Navlinks from "./Navlinks";
import { motion } from "framer-motion";
import EaseString from "./EaseString";

const Appbar = () => {
  return (
    <div className="w-full absolute top-0 ">
      <div className=" w-full justify-between flex px-6 sm:h-24 items-center py-3">
        <div className="w-full">
          <EaseString word="INTRANET" size="text-md md:text-xl" />
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
        ></motion.div>
      </div>
      <motion.hr
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1 }}
        className="border-b-0 border-black dark:border-white w-full"
      />
    </div>
  );
};

export default Appbar;
