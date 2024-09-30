import React from "react";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  mode: string;
  handleModeChange: () => void;
}

const UserInfo: React.FC<Props> = ({ mode, handleModeChange }) => {
  return (
    <>
      <div className="flex flex-row-reverse">
        <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-1 cursor-pointer rounded mb-5">
          <div className="flex items-center gap-3" onClick={handleModeChange}>
            {mode === "save" ? (
              <>
                <Icon icon={"lucide:edit"} className="w-5 h-5" />
                <p className="text-md">Edit profile</p>
              </>
            ) : (
              <>
                <Icon icon={"mingcute:save-line"} className="w-5 h-5" />
                <p className="text-md">Save profile</p>
              </>
            )}
          </div>
        </HoverBox>
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex justify-between">
          <p>First name</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Middle name</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Last name name</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Suffix</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Gender</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Date of birth</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Address</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
        <div className="flex justify-between">
          <p>Civil Status</p>
          <input
            disabled={mode === "save"}
            className="border-b dark:border-neutral-700 dark:bg-neutral-900 outline-none"
          />
        </div>
      </div>
    </>
  );
};

export default UserInfo;
