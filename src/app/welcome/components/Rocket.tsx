"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

const Rocket = () => {
  const scrollToTop = () => {
    console.log("Scroll to top clicked"); // To verify if the function runs
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="hidden md:flex fixed bottom-6 right-8">
      <div
        onClick={scrollToTop}
        className="h-10 w-10 grid place-content-center rounded-full bg-white dark:bg-black border dark:border-neutral-700 cursor-pointer"
      >
        <Icon icon="material-symbols:rocket-outline" className="h-6 w-6" />
      </div>
    </div>
  );
};

export default Rocket;
