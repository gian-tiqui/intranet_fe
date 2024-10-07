"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/compat/router";

const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    const handleBeforeUnload = () => {
      setIsLoading(true);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // const handleRouteChange = (url: string) => {
    //   setIsLoading(true);
    //   setTimeout(() => setIsLoading(false), 2000);
    // };

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

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 w-full h-full flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  );
};

export default PageLoader;
