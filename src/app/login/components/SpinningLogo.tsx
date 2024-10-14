"use client";
import React from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import Image from "next/image";
import { motion } from "framer-motion";

const SpinningLogo = () => {
  return (
    <div className="h-screen w-screen absolute md:grid place-content-center hidden">
      <motion.div
        style={{
          perspective: 1000,
        }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Image
          src={wmcLogo}
          width={200}
          height={100}
          className="h-auto w-auto"
          alt="Westlake Med"
          style={{ transformStyle: "preserve-3d" }}
        />
      </motion.div>
    </div>
  );
};

export default SpinningLogo;
