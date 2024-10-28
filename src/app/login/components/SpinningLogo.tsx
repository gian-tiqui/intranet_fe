"use client";
import React from "react";
import wmcLogo from "../../assets/westlake_logo_horizontal.jpg.png";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const SpinningLogo = () => {
  const router = useRouter();

  return (
    <motion.div
      style={{
        perspective: 1000,
      }}
      onClick={() => router.push("/welcome")}
      animate={{ rotateY: 360 }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute top-5 z-50 left-5 flex gap-2"
    >
      <Image
        src={wmcLogo}
        width={40}
        height={20}
        className="h-auto w-auto"
        alt="Westlake Med"
        style={{ transformStyle: "preserve-3d" }}
      />
    </motion.div>
  );
};

export default SpinningLogo;
