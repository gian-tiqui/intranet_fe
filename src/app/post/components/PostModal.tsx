"use client";
import useToggleStore from "@/app/store/navbarCollapsedStore";
import useShowPostStore from "@/app/store/showPostStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

const PostModal = () => {
  const { setVisible } = useShowPostStore();
  const { setIsCollapsed } = useToggleStore();
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleFormClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setIsCollapsed(true);
    return () => setIsCollapsed(false);
  }, [setIsCollapsed]);

  return (
    <div
      onClick={() => setVisible(false)}
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
    >
      <div
        className="p-4 w-80 rounded-2xl bg-white dark:bg-neutral-900"
        onClick={handleFormClick}
      >
        <div className="flex items-start gap-3 mb-2">
          <div className="rounded-full w-10 h-10 bg-gray-400"></div>
          <p className="font-bold">Westlake User</p>
        </div>
        <form>
          <div>
            <input
              className="w-full outline-none p-2 dark:bg-neutral-900"
              placeholder="Memo title"
            />
            <hr className="w-full border-b border dark:border-neutral-800" />
            <textarea
              className="w-full h-40 outline-none p-2 dark:bg-neutral-900"
              placeholder="Is there something you want to write for the memo?"
            />

            <div className="w-full p-4 mb-4 dark:bg-neutral-900 rounded-md">
              <div className="relative w-full border border-dashed border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all duration-200">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Icon
                    icon={"material-symbols:upload"}
                    className="h-10 w-10"
                  />
                  <span className="mt-2 text-sm">
                    {fileName ? fileName : "Click to upload memo"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full border rounded-xl h-10 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostModal;