"use client";
import useDarkModeStore from "@/app/store/darkModeStore";
import React, { useEffect } from "react";

const DashboardMain = () => {
  const { setIsDarkMode } = useDarkModeStore();

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
  return (
    <div className="h-screen w-full bg-neutral-200 dark:bg-neutral-800"></div>
  );
};

export default DashboardMain;
