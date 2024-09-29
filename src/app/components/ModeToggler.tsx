"use client";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import useDarkModeStore from "../store/darkModeStore";

const ModeToggler = () => {
  const { isDarkMode, setIsDarkMode } = useDarkModeStore();

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");

    if (storedMode === "true") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, [setIsDarkMode]);

  const toggleDarkMode = () => {
    const currentMode = document.documentElement.classList.contains("dark");

    if (currentMode) {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
      localStorage.setItem("darkMode", "true");
    }
  };

  return (
    <button
      className="rounded-full grid place-content-center h-10 w-10 bg-neutral-300 dark:bg-neutral-900 hover:bg-neutral-400 dark:hover:bg-neutral-700"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <Icon icon={"line-md:sunny-loop"} className="h-7 w-7" />
      ) : (
        <Icon icon={"line-md:moon-rising-alt-loop"} className="h-7 w-7" />
      )}
    </button>
  );
};

export default ModeToggler;
