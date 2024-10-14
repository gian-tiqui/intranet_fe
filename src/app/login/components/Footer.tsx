"use client";
import React from "react";
import { motion } from "framer-motion";

const Footer = () => {
  const word = "Westlake Medical Center";

  return (
    <footer className="absolute bottom-0 w-full">
      <div className="px-7 flex justify-between items-center mb-2" key={0}>
        <div>
          <motion.p
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.05,
            }}
            className="text-sm"
          >
            Alagang Westlake,
          </motion.p>
          <motion.p
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.15,
            }}
            className="text-sm"
          >
            Alagang mapagkakatiwalaan
          </motion.p>
        </div>
        <div>
          <motion.p
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.05,
            }}
            className="text-sm"
          >
            © 20xx
          </motion.p>
        </div>
      </div>
      <div className="flex flex-row-reverse w-full">
        <motion.hr
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1 }}
          className="border-b-0 border-black dark:border-white w-full"
        />
      </div>

      <div className="flex  h-14 items-center w-full px-6" key={1}>
        {word.split("").map((letter, index) => (
          <motion.p
            key={index}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: index * 0.01,
            }}
            className="mx-1 text-lg"
          >
            {letter}
          </motion.p>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
