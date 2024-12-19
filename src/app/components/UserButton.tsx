"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { API_BASE, INTRANET } from "../bindings/binding";
import useShowSettingsStore from "../store/showSettingStore";
import useLogoutArtStore from "../store/useLogoutSplashStore";
import { decodeUserData } from "../functions/functions";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { toastClass } from "../tailwind-classes/tw_classes";
import useToggleStore from "../store/navbarCollapsedStore";

interface Props {
  uVisible: boolean;
  setUVisible: (visible: boolean) => void;
  isMobile?: boolean;
}

const UserButton: React.FC<Props> = ({ uVisible, setUVisible, isMobile }) => {
  const { setShowLogoutArt } = useLogoutArtStore();
  const { setHidden } = useNavbarVisibilityStore();
  const { setShown } = useShowSettingsStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { isCollapsed, setIsCollapsed } = useToggleStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    departmentName: string;
  } | null>(null);
  const router = useRouter();
  const [showMyPosts, setShowMyPosts] = useState<boolean>(false);

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
      const userDept = decodeUserData()?.departmentCode;

      if (userDept?.toLowerCase() === "it") setIsAdmin(true);
    };

    checkRole();
  }, []);

  const handleLogout = async (event: React.MouseEvent) => {
    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        const response = await apiClient.post(`${API_BASE}/auth/logout`, {
          userId: userId,
        });

        toast(response.data.message, {
          type: "success",
          className: toastClass,
        });
      } catch (error) {
        console.error(error);

        const { message } = error as { message: string };
        toast(message, { type: "error", className: toastClass });
      }
    }

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

  useEffect(() => {
    const dept = decodeUserData()?.departmentCode.toLowerCase();
    if (dept && ["hr", "qm", "admin"].includes(dept)) setShowMyPosts(true);
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
              <div
                className="w-full flex gap-2 items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
                onClick={() => router.push("/admin/dashboard")}
              >
                <Icon icon={"file-icons:dashboard"} className="w-6 h-6" />
                <p>Dashboard</p>
              </div>
            </>
          )}
          {showMyPosts && (
            <div
              className="w-full flex gap-2 items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
              onClick={() => {
                router.push("/monitoring");

                if (isMobile) setIsCollapsed(!isCollapsed);
              }}
            >
              <Icon icon={"mdi:list-status"} className="w-6 h-6" />
              <p className="text-sm">Monitoring</p>
            </div>
          )}
          <div
            className="w-full flex gap-2 items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
            onClick={() => {
              router.push("/history");

              if (isMobile) setIsCollapsed(!isCollapsed);
            }}
          >
            <Icon icon={"material-symbols:post-outline"} className="w-6 h-6" />
            <p className="text-sm">History</p>
          </div>
          <div
            className="w-full gap-2 items-center hidden md:flex hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
            onClick={handleShowSettings}
          >
            <Icon icon={"uil:setting"} className="w-6 h-6" />
            <p className="text-sm">Settings</p>
          </div>

          <div
            className="w-full flex gap-2 items-center md:hidden hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
            onClick={handleShowSettingsMobile}
          >
            <Icon icon={"uil:setting"} className="w-6 h-6" />
            <p className="text-sm">Settings</p>
          </div>
          <hr className="w-full border border-neutral-200 dark:border-neutral-700" />
          <div
            className="w-full flex gap-2 items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded"
            onClick={handleLogout}
          >
            <Icon icon={"material-symbols:logout"} className="w-6 h-6" />
            <p className="text-sm">Logout</p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-800 p-2 cursor-pointer rounded">
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
    </div>
  );
};

export default UserButton;
