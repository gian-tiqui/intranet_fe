"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const Intranet = () => {
  const word = "INTRANET";

  return (
    <AnimatePresence>
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
            className="mx-1 text-xl"
          >
            {letter}
          </motion.p>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default Intranet;
