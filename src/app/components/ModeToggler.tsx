"use client";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import useDarkModeStore from "../store/darkModeStore";

interface Props {
  size?: number;
}

const ModeToggler: React.FC<Props> = ({ size }) => {
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
    <div
      className={`cursor-pointer rounded-full grid place-content-center ${
        size ? `h-${size + 3} w-${size + 3}` : "h-10 w-10"
      } bg-white dark:bg-neutral-900 hover:bg-neutral-400 dark:hover:bg-neutral-700`}
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <Icon
          icon={"line-md:sunny-loop"}
          className={`${size ? `h-${size} w-${size}` : "h-7 w-7"}`}
        />
      ) : (
        <Icon
          icon={"line-md:moon-rising-alt-loop"}
          className={`${size ? `h-${size} w-${size}` : "h-7 w-7"}`}
        />
      )}
    </div>
  );
};

export default ModeToggler;
