"use client";
import { Icon } from "@iconify/react";
import React, { useEffect } from "react";
import useDarkModeStore from "../store/darkModeStore";

const ModeToggler = () => {
  const { isDarkMode, setIsDarkMode } = useDarkModeStore();

  useEffect(() => {
    if (document.body.classList.contains("dark")) {
      setIsDarkMode(true);
    }
  }, [setIsDarkMode]);

  const toggleDarkMode = () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      document.body.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  return (
    <button
      className="rounded-full grid place-content-center h-9 w-9 bg-white dark:bg-neutral-800"
      onClick={toggleDarkMode}
    >
      <Icon icon={isDarkMode ? "tabler:sun-filled" : "tabler:moon-filled"} />
    </button>
  );
};

export default ModeToggler;
