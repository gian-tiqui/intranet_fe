"use client";
import React, { useRef } from "react";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { INTRANET } from "../page";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";

interface Props {
  uVisible: boolean;
  setUVisible: (visible: boolean) => void;
}

const UserButton: React.FC<Props> = ({ uVisible, setUVisible }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();

  const handleLogout = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Logging out...");
    setHidden(false);
    Cookies.remove(INTRANET);
    localStorage.removeItem(INTRANET);

    router.push("/login");
  };

  return (
    <div
      ref={ref}
      className="px-3 mb-3 relative"
      onClick={() => setUVisible(true)}
    >
      {uVisible && (
        <div className="absolute p-3 w-full bg-white dark:bg-neutral-800 border-[1px] flex flex-col gap-3 border-neutral-200 dark:border-neutral-700 bottom-12 rounded-2xl">
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
            <div className="w-full flex gap-2 items-center">
              <Icon
                icon={"material-symbols:post-outline"}
                className="w-6 h-6"
              />
              <p>My posts</p>
            </div>
          </HoverBox>
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
            <div className="w-full flex gap-2 items-center">
              <Icon icon={"uil:setting"} className="w-6 h-6" />
              <p>Settings</p>
            </div>
          </HoverBox>
          <hr className="w-full border border-neutral-200 dark:border-neutral-700" />
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
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
      <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-900 p-2 cursor-pointer rounded">
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
