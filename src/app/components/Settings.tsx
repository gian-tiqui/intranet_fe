import React, { useState } from "react";
import useShowSettingsStore from "../store/showSettingStore";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import UserInfo from "./UserInfo";
import Password from "./Password";

const Settings = () => {
  const { setShown } = useShowSettingsStore();
  const [mode, setMode] = useState<string>("save");
  const [fragment, setFragment] = useState<string>("userInfo");

  const handleModeChange = () => {
    setMode(mode === "save" ? "edit" : "save");
  };

  const stopPropa = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
      onClick={() => setShown(false)}
    >
      <div
        className="md:w-[700px] rounded-3xl h-96 bg-white dark:bg-neutral-900 p-8"
        onClick={stopPropa}
      >
        <div className="flex justify-between items-start w-full mb-5">
          <div className="flex gap-3 w-full">
            <div className="h-10 w-10 bg-neutral-300 rounded-full"></div>
            <div>
              <p>Westlake User</p>
              <p className="text-xs">IT Department</p>
            </div>
          </div>
          <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded flex items-center gap-3">
            <Icon
              icon={"iconamoon:exit-light"}
              className="h-7 w-7"
              onClick={() => setShown(false)}
            />
          </HoverBox>
        </div>
        <hr className="w-full mb-4 border-t dark:border-gray-700" />
        <div className="flex">
          <div className="w-1/3 flex flex-col p-2">
            <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div
                className=" flex items-center gap-3"
                onClick={() => setFragment("userInfo")}
              >
                <Icon icon={"mdi:user-outline"} className="w-6 h-6" />
                <p className="">User Information</p>
              </div>
            </HoverBox>
            <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div
                className="flex items-center gap-3"
                onClick={() => setFragment("password")}
              >
                <Icon icon={"mdi:password-outline"} className="w-6 h-6" />
                <p className="">Password</p>
              </div>
            </HoverBox>
          </div>
          <div className="w-2/3 p-2 overflow-auto h-56">
            {fragment === "userInfo" && (
              <UserInfo mode={mode} handleModeChange={handleModeChange} />
            )}
            {fragment === "password" && <Password />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;