import React from "react";
import AuthListener from "./components/AuthListener";
import Link from "next/link";

export const INTRANET = "intranet";

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
            className="bg-white dark:bg-neutral-900 h-12 text-2xl w-40 rounded-2xl shadow hover:bg-black grid place-content-center"
          >
            Memos
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
