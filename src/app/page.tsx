import React from "react";
import AuthListener from "./components/AuthListener";
import Link from "next/link";

const Home = () => {
  return (
    <>
      <AuthListener />

      <div className="grid place-content-center h-[600px]">
        <div className="flex gap-4 font-bold flex-col items-center">
          <h1 className="text-3xl">There is nothing here</h1>
          <h1 className="text-3xl">Go to memos</h1>
          <Link
            href={"/post"}
            className="bg-neutral-300 mt-5 dark:bg-neutral-700 border border-neutral-400 dark:border-neutral-700 h-12 text-xl w-40 rounded-2xl shadow dark:hover:bg-neutral-600 grid place-content-center"
          >
            Memos
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
