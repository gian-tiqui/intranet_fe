"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

const First = () => {
  return (
    <div className="text-black w-full md:w-96">
      <div
        className="flex flex-wrap mb-7"
        style={{
          overflow: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {"Welcome to Intranet".split("").map((letter, index) => (
          <motion.h1
            key={index}
            className="text-2xl md:text-4xl font-semibold inline-block dark:text-white"
            initial={{ scale: 0 }}
            animate={{ rotateY: 360, scale: 1 }}
            transition={{
              duration: 0.01,
              delay: 0.04 * index,
              ease: "easeInOut",
            }}
            exit={{ rotateX: -360, scale: 0 }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.h1>
        ))}
      </div>

      <div
        className="flex flex-wrap mb-7 dark:text-white"
        style={{
          overflow: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <motion.h1
          className="font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
        >
          We, at Westlake Medical Center are committed to deliver Quality and
          Holistic Healthcare Service to our patients.
        </motion.h1>

        <motion.h1
          className="font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.1,
          }}
        >
          We do it by caring through exemplary medical practices, advocating
          patient safety and meeting customer satisfaction by setting quality
          standards thereby achieving our goals and targets.
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.2,
          }}
        >
          We guarantee firm adherence to the requirement of the standard as well
          as regulatory bodies and ethical code of conduct in order to
          continually review and improve suitability of our QMS.
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.3,
          }}
        >
          Jose Mari G. Pratz - President
        </motion.h1>
      </div>
    </div>
  );
};
const Second = () => {
  return (
    <div className="text-black w-full md:w-96">
      <div
        className="flex flex-wrap mb-7"
        style={{
          overflow: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      ></div>

      <div
        className="flex flex-wrap mb-7 dark:text-white"
        style={{
          overflow: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        <motion.h1
          className="font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
        >
          At Westlake, your health comes first. Efficient services and
          high-quality equipment is available for you at a cost more affordable
          compared to major hospitals in the Metro.
        </motion.h1>

        <motion.h1
          className="font-semibold mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.1,
          }}
        >
          Westlake’s efforts to provide affordable and quality healthcare began
          to concretize in 2015 when they became part of Mount Grace Hospitals
          Inc. (MGHI)-- a nationwide network of hospitals whose purpose it is to
          ensure equipped and capable hospitals that offer comprehensive,
          excellent, and compassionate healthcare to Filipinos.
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.2,
          }}
        >
          We guarantee firm adherence to the requirement of the standard as well
          as regulatory bodies and ethical code of conduct in order to
          continually review and improve suitability of our QMS.
        </motion.h1>
      </div>
    </div>
  );
};

const ChangingContainer = () => {
  const [index, setIndex] = useState<number>(0);
  const [selectedComp, setSelectedComp] = useState<ReactNode>(<First />);

  useEffect(() => {
    const changeComp = () => {
      const comps: ReactNode[] = [<First key={0} />, <Second key={1} />];

      const newIndex = (index + 1) % comps.length;
      setIndex(newIndex);
      setSelectedComp(comps[newIndex]);
    };

    const timer = setTimeout(changeComp, 7000);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="mx-auto h-[500px] px-4 md:h-auto md:px-0">
      {selectedComp}
    </div>
  );
};

export default ChangingContainer;
