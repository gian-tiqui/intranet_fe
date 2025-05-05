"use client";
import React from "react";
import { motion } from "motion/react";
import WeMeanCare from "@/app/components/WeMeanCare";

const Curtain = () => {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 overflow-hidden z-40 pointer-events-none">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -1000 }}
        transition={{ delay: 3, duration: 1 }}
        className="h-[50vh] bg-[#CBD5E1] w-full"
      />
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: 1000 }}
        transition={{ delay: 3, duration: 1 }}
        className="h-[50vh] bg-[#CBD5E1] w-full"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <WeMeanCare />
      </div>
      <motion.div
        initial={{ opacity: 1, scaleX: 0 }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          scaleX: [0, 0, 0, 0, 1, 1],
        }}
        transition={{
          duration: 3,
          times: [0, 0.3, 1],
        }}
        className="absolute bottom-8 left-36 bg-blue-600 h-8 rounded-xl w-[80%] origin-left"
      />
    </div>
  );
};

export default Curtain;
