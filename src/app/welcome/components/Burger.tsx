"use client";
import { Icon } from "@iconify/react";
import React from "react";

interface Props {
  size?: number;
}

const Burger: React.FC<Props> = ({ size }) => {
  return (
    <div
      className={`cursor-pointer rounded-full grid place-content-center ${
        size ? `h-${size + 3} w-${size + 3}` : "h-10 w-10"
      } bg-white dark:bg-neutral-900 hover:bg-neutral-400 dark:hover:bg-neutral-700`}
    >
      <Icon
        icon={"majesticons:burger-line"}
        className={`${size ? `h-${size} w-${size}` : "h-7 w-7"}`}
      />
    </div>
  );
};

export default Burger;
