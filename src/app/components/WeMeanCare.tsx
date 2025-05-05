"use client";
import React from "react";
import { motion } from "motion/react";

const WeMeanCare = () => {
  return (
    <div className="w-full flex flex-col items-center p-20">
      <motion.div
        initial={{ opacity: 1, y: 210 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="flex gap-5 text-7xl font-black font-serif"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1 }}
        >
          <motion.span className="text-blue-600">W</motion.span>
          <motion.span>e.</motion.span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.span className="text-blue-600">M</motion.span>
          <motion.span>ean.</motion.span>
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <motion.span className="text-blue-600">C</motion.span>
          <motion.span>are.</motion.span>
        </motion.h1>
      </motion.div>
    </div>
  );
};

export default WeMeanCare;
