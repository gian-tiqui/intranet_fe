"use client";
import { useLottie } from "lottie-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import notFound from "../assets/404v2.json";

const ErrorPage = () => {
  const options = {
    animationData: notFound,
    loop: true,
  };
  const [count, setCount] = useState<number>(4);
  const router = useRouter();
  const { View } = useLottie(options);

  useEffect(() => {
    if (count == 0) router.push("/");

    const intervalId = setInterval(() => {
      setCount((prevcount) => (prevcount > 0 ? prevcount - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [count, router]);

  return (
    <div className="h-screen w selection:-screen grid place-content-center bg-neutral-200 text-neutral-900 font-mono">
      <div className="w-96 flex flex-col">
        {View}
        <p className="text-2xl text-center font-bold">
          Sadly this page doesn&apos;t exist
        </p>
        <p className="text-lg text-center font-bold ">
          Redirecting you to home in {count}...
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
