"use client";
import React from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import Image from "next/image";
import { motion } from "framer-motion";

const SpinningLogo = () => {
  return (
    <motion.div
      style={{ perspective: 1000 }}
      animate={{ rotateY: 360 }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <Image
        src={wmcLogo}
        width={100000}
        height={100000}
        className="absolute z-0 h-96 w-auto md:top-[160px] md:left-[600px]"
        alt="Westlake Med"
        style={{ transformStyle: "preserve-3d" }}
      />
    </motion.div>
  );
};

export default SpinningLogo;
