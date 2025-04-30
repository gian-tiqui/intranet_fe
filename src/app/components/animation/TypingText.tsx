import { motion } from "framer-motion";
import React from "react";

interface Props {
  text: string;
}

const TypingText: React.FC<Props> = ({ text }) => {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ display: "flex", overflow: "hidden" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char: string, index: number) => (
        <motion.span variants={child} key={index}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TypingText;
