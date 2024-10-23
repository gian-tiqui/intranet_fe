"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/compat/router";

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [delayUnmount, setDelayUnmount] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setDelayUnmount(false);
    };

    const handleComplete = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 10000);

      setDelayUnmount(true);
    };

    const handleBeforeUnload = () => {
      setIsLoading(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    router?.events.on("routeChangeStart", handleStart);
    router?.events.on("routeChangeComplete", handleComplete);
    router?.events.on("routeChangeError", handleComplete);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router?.events.off("routeChangeStart", handleStart);
      router?.events.off("routeChangeComplete", handleComplete);
      router?.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  if (!isLoading && !delayUnmount) return null;

  return (
    <div className="fixed inset-0 bg-neutral-200 text-black dark:text-white dark:bg-neutral-900 z-50 w-full h-full flex items-center justify-center">
      <p className="text-3xl font-bold"> Refreshing...</p>
    </div>
  );
};

export default PageLoader;
