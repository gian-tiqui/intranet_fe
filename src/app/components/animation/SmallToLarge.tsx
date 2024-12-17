"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export interface Props {
  children: ReactNode;
  duration?: number;
}

// This component will appear from the bottom of the UI when the children appear in the DOM.

const SmallToLarge: React.FC<Props> = ({ children, duration = 0.1 }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: duration }}
      className="absolute z-50 right-3"
    >
      {children}
    </motion.div>
  );
};

export default SmallToLarge;
