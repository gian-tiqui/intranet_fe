"use client";
import React from "react";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <div className="flex justify-center items-center w-full">
      <motion.p
        className="text-blue-600 font-medium"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7, duration: 1 }}
      >
        Powered by Westlake Medical Center ICT Department
      </motion.p>
    </div>
  );
};

export default Footer;
