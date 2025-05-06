"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const WeMeanCare = () => {
  const [turnBlue, setTurnBlue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTurnBlue(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-col items-center relative z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="flex gap-5 text-7xl font-black font-serif"
      >
        <motion.h1
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0, duration: 1 }}
        >
          <motion.span className="text-blue-600">W</motion.span>
          <motion.span
            className={`transition-colors duration-500 ${
              turnBlue ? "text-blue-600" : "text-gray-600"
            }`}
          >
            e.
          </motion.span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          <motion.span className="text-blue-600">M</motion.span>
          <motion.span
            className={`transition-colors duration-500 ${
              turnBlue ? "text-blue-600" : "text-gray-600"
            }`}
          >
            ean.
          </motion.span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.span className="text-blue-600">C</motion.span>
          <motion.span
            className={`transition-colors duration-500 ${
              turnBlue ? "text-blue-600" : "text-gray-600"
            }`}
          >
            are.
          </motion.span>
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default WeMeanCare;
