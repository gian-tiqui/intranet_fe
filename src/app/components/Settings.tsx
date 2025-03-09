import React, { useState } from "react";
import useShowSettingsStore from "../store/showSettingStore";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import UserInfo from "./UserInfo";
import Password from "./Password";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { decodeUserData } from "../functions/functions";
import SecretQuestion from "./SecretQuestion";

const Settings = () => {
  const { setShown } = useShowSettingsStore();
  const [fragment, setFragment] = useState<string>("userInfo");
  const { setHidden } = useNavbarVisibilityStore();

  const stopPropa = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOuterChange = () => {
    const userDept = decodeUserData()?.departmentName;

    if (userDept?.toLowerCase() !== "admin") setHidden(true);
    setShown(false);
  };

  return (
    <div
      className="min-w-full min-h-full bg-black bg-opacity-85 absolute z-40 grid place-content-center"
      onClick={handleOuterChange}
    >
      <div
        className="w-82 md:w-[700px] md:h-96 rounded-3xl bg-white dark:bg-neutral-900 p-8"
        onClick={stopPropa}
      >
        <div className="flex justify-between items-start w-full mb-5">
          <div className="flex gap-3 w-full">
            <div className="h-10 w-10 bg-neutral-300 rounded-full"></div>
            <div>
              <p>
                {decodeUserData()?.firstName} {decodeUserData()?.lastName}
              </p>
              <p className="text-xs">{decodeUserData()?.departmentName}</p>
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

        <div className="grid md:flex">
          <div className="md::w-1/3 flex flex-col p-2">
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
            <HoverBox className="hover:bg-neutral-300 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
              <div
                className="flex items-center gap-3"
                onClick={() => setFragment("secret")}
              >
                <Icon
                  icon={"mingcute:user-security-line"}
                  className="w-6 h-6"
                />
                <p className="">Secret Questions</p>
              </div>
            </HoverBox>
          </div>
          <div className="md:w-2/3 p-2 h-64 overflow-auto">
            {fragment === "userInfo" && <UserInfo />}
            {fragment === "password" && <Password />}
            {fragment === "secret" && <SecretQuestion />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
