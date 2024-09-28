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
      className="rounded-full grid place-content-center h-9 w-9 bg-white dark:bg-neutral-800"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? (
        <Icon icon={"tabler:sun-filled"} />
      ) : (
        <Icon icon={"solar:moon-bold"} />
      )}
    </button>
  );
};

export default ModeToggler;
