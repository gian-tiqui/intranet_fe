"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

const First = () => {
  return (
    <div className="text-black h-96 w-96">
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
            className="text-4xl font-semibold inline-block dark:text-white"
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
          className="font-semibold "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
        >
          consectetur adipiscing elit
        </motion.h1>

        <motion.h1
          className="font-semibold "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.1,
          }}
        >
          consectetur adipiscing elit asdasdasa
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
          consectetur adipiscing elit asdasdasa
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
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.4,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.5,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.6,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.7,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.8,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.9,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.99,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>
      </div>
    </div>
  );
};
const Second = () => {
  return (
    <div className="text-black h-96 w-96">
      <div
        className="flex flex-wrap mb-7"
        style={{
          overflow: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
        }}
      >
        {"View your memos here".split("").map((letter, index) => (
          <motion.h1
            key={index}
            className="text-4xl font-semibold inline-block dark:text-white"
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
          className="font-semibold "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.5,
          }}
        >
          consectetur adipiscing elit
        </motion.h1>

        <motion.h1
          className="font-semibold "
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.1,
          }}
        >
          consectetur adipiscing elit asdasdasa
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
          consectetur adipiscing elit asdasdasa
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
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.4,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.5,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.6,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.7,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.8,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.9,
          }}
        >
          consectetur adipiscing elit asdasdasa
        </motion.h1>

        <motion.h1
          className="font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            delay: 0.99,
          }}
        >
          consectetur adipiscing elit asdasdasa
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

    const timer = setTimeout(changeComp, 6000);

    return () => clearTimeout(timer);
  }, [index]);

  return <div className="w-full h-full">{selectedComp}</div>;
};

export default ChangingContainer;
