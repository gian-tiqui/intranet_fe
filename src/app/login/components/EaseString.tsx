"use client";
import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  word: string;
  size: string;
}

const EaseString: React.FC<Props> = ({ word, size }) => {
  return (
    <div className="flex md:gap-2 text-xl font-bold">
      {word.toLowerCase() === "intranet" && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
        >
          <Icon icon={"ph:hospital-light"} className="h-6 w-6 md:h-7 md:w-7" />
        </motion.div>
      )}
      <div className="flex">
        {word.split("").map((letter, index) => (
          <motion.p
            key={index}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: index * 0.05,
            }}
            className={`${word.toLowerCase() === "intranet" && "mx-1"} ${size}`}
          >
            {letter}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default EaseString;
