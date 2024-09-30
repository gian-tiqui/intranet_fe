"use client";
import React from "react";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { INTRANET } from "../bindings/binding";
import useShowSettingsStore from "../store/showSettingStore";

interface Props {
  uVisible: boolean;
  setUVisible: (visible: boolean) => void;
}

const UserButton: React.FC<Props> = ({ uVisible, setUVisible }) => {
  const { setHidden } = useNavbarVisibilityStore();
  const { setShown } = useShowSettingsStore();
  const router = useRouter();

  const handleLogout = (event: React.MouseEvent) => {
    event.stopPropagation();
    setHidden(false);
    Cookies.remove(INTRANET);
    localStorage.removeItem(INTRANET);

    router.push("/login");
  };

  const handleShowSettings = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShown(true);
  };

  const handleOpenModal = () => {
    setUVisible(true);
  };

  return (
    <div className="px-3 mb-3 relative" onClick={handleOpenModal}>
      {uVisible && (
        <div
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="absolute z-50 p-3 w-full bg-white dark:bg-neutral-900 border-[1px] flex flex-col gap-3 border-neutral-200 dark:border-neutral-700 bottom-12 rounded-2xl"
        >
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <div className="w-full flex gap-2 items-center">
              <Icon
                icon={"material-symbols:post-outline"}
                className="w-6 h-6"
              />
              <p>My posts</p>
            </div>
          </HoverBox>
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <div
              className="w-full flex gap-2 items-center"
              onClick={handleShowSettings}
            >
              <Icon icon={"uil:setting"} className="w-6 h-6" />
              <p>Settings</p>
            </div>
          </HoverBox>
          <hr className="w-full border border-neutral-200 dark:border-neutral-700" />
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <div
              className="w-full flex gap-2 items-center"
              onClick={handleLogout}
            >
              <Icon icon={"material-symbols:logout"} className="w-6 h-6" />
              <p>Logout</p>
            </div>
          </HoverBox>
        </div>
      )}
      <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-neutral-200 h-8 w-8"></div>
          <div>
            <p className="text-sm">Westlake User</p>
            <p className="text-xs truncate">IT Department</p>
          </div>
        </div>
      </HoverBox>
    </div>
  );
};

export default UserButton;
