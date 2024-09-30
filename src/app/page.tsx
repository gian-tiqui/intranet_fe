import React from "react";
import AuthListener from "./components/AuthListener";
import { Icon } from "@iconify/react/dist/iconify.js";

const Home = () => {
  return (
    <>
      <AuthListener />

      <div className="grid place-content-center h-[600px]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="w-32 h-32 p-4 rounded-lg dark:bg-neutral-800 border border-neutral-300 hover:bg-gray-300 cursor-pointer dark:border-neutral-700 dark:hover:bg-neutral-700">
            <Icon icon={"carbon:view"} className="mb-2 h-5 w-5" />
            <p>View all memos</p>
          </div>
          <div className="w-32 h-32 p-4 rounded-lg dark:bg-neutral-800 border border-neutral-300 hover:bg-gray-300 cursor-pointer dark:border-neutral-700 dark:hover:bg-neutral-700">
            <Icon
              icon={"material-symbols:post-add-sharp"}
              className="mb-2 h-5 w-5"
            />
            <p>Post a memo</p>
          </div>
          <div className="w-32 h-32 p-4 rounded-lg dark:bg-neutral-800 border border-neutral-300 hover:bg-gray-300 cursor-pointer dark:border-neutral-700 dark:hover:bg-neutral-700">
            <Icon
              icon={"material-symbols:settings-outline"}
              className="mb-2 h-5 w-5"
            />
            <p>Edit your settings</p>
          </div>
          <div className="w-32 h-32 p-4 rounded-lg dark:bg-neutral-800 border border-neutral-300 hover:bg-gray-300 cursor-pointer dark:border-neutral-700 dark:hover:bg-neutral-700">
            <Icon
              icon={"material-symbols:post-outline"}
              className="mb-2 h-5 w-5"
            />
            <p>View your posts</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
