"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

const shakeAnimation = {
  initial: { x: 0 },
  animate: {
    x: [0, -5, 10, -5, 10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    },
  },
};

const MotionP = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  return (
    <AnimatePresence>
      <motion.p
        className={className}
        variants={shakeAnimation}
        initial="initial"
        animate="animate"
        exit="initial"
      >
        {children}
      </motion.p>
    </AnimatePresence>
  );
};

export default MotionP;
