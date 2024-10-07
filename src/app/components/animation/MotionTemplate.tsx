"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

export interface MotionTemplateProps {
  children: ReactNode;
  duration?: number;
}

// This component will appear from the bottom of the UI when the children appear in the DOM.

const MotionTemplate: React.FC<MotionTemplateProps> = ({
  children,
  duration = 0.3,
}) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ ease: "easeInOut", duration: duration }}
    >
      {children}
    </motion.div>
  );
};

export default MotionTemplate;
