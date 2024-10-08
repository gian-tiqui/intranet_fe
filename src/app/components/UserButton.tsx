"use client";
import React, { useEffect, useState } from "react";
import HoverBox from "./HoverBox";
import { Icon } from "@iconify/react/dist/iconify.js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { INTRANET } from "../bindings/binding";
import useShowSettingsStore from "../store/showSettingStore";
import useLogoutArtStore from "../store/useLogoutSplashStore";
import { decodeUserData } from "../functions/functions";

interface Props {
  uVisible: boolean;
  setUVisible: (visible: boolean) => void;
}

const UserButton: React.FC<Props> = ({ uVisible, setUVisible }) => {
  const { setShowLogoutArt } = useLogoutArtStore();
  const { setHidden } = useNavbarVisibilityStore();
  const { setShown } = useShowSettingsStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    departmentName: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = () => {
      if (uVisible) {
        setUVisible(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [setUVisible, uVisible]);

  useEffect(() => {
    const checkRole = () => {
      const userDept = decodeUserData()?.departmentName;

      if (userDept?.toLowerCase() === "admin") setIsAdmin(true);
    };

    checkRole();
  }, []);

  const handleLogout = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowLogoutArt(true);
    setHidden(false);
    Cookies.remove(INTRANET);
    localStorage.removeItem(INTRANET);
    router.push("/login");
  };

  useEffect(() => {
    const data = decodeUserData();
    if (data) {
      setUserData(data);
    }
    setLoading(false);
  }, []);

  const handleShowSettings = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShown(true);
  };

  const handleShowSettingsMobile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setHidden(false);
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
          {isAdmin && (
            <>
              <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
                <div
                  className="w-full flex gap-2 items-center"
                  onClick={() => router.push("/admin/dashboard")}
                >
                  <Icon icon={"file-icons:dashboard"} className="w-6 h-6" />
                  <p>Dashboard</p>
                </div>
              </HoverBox>
            </>
          )}
          <HoverBox className="hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <div
              className="w-full flex gap-2 items-center"
              onClick={() => router.push("/")}
            >
              <Icon
                icon={"material-symbols:post-outline"}
                className="w-6 h-6"
              />
              <p>My posts</p>
            </div>
          </HoverBox>
          <HoverBox className="hidden md:block hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <div
              className="w-full flex gap-2 items-center"
              onClick={handleShowSettings}
            >
              <Icon icon={"uil:setting"} className="w-6 h-6" />
              <p>Settings</p>
            </div>
          </HoverBox>

          <HoverBox className="block md:hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
            <div
              className="w-full flex gap-2 items-center"
              onClick={handleShowSettingsMobile}
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
            {loading ? (
              <p className="text-sm">Loading...</p>
            ) : userData ? (
              <>
                <p className="text-sm">{`${userData.firstName} ${userData.lastName}`}</p>
                <p className="text-xs truncate">{userData.departmentName}</p>
              </>
            ) : (
              <p className="text-sm">User not found</p>
            )}
          </div>
        </div>
      </HoverBox>
    </div>
  );
};

export default UserButton;
