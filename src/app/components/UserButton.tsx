"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import useNavbarVisibilityStore from "../store/navbarVisibilityStore";
import { API_BASE, INTRANET } from "../bindings/binding";
import useLogoutArtStore from "../store/useLogoutSplashStore";
import { decodeUserData } from "../functions/functions";
import { toast } from "react-toastify";
import apiClient from "../http-common/apiUrl";
import { toastClass } from "../tailwind-classes/tw_classes";
import { Avatar } from "primereact/avatar";
import SettingsDialog from "./SettingsDialog";
import UserModal from "./UserModal";
import useLoginStore from "../store/loggedInStore";

interface Props {
  isMobile?: boolean;
}

const UserButton: React.FC<Props> = () => {
  const [settingsDialogVisible, setSettingsDialogVisible] =
    useState<boolean>(false);
  const { setShowLogoutArt } = useLogoutArtStore();
  const { setHidden } = useNavbarVisibilityStore();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { setIsLoggedIn } = useLoginStore();
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    departmentName: string;
  } | null>(null);
  const router = useRouter();
  const [showMyPosts, setShowMyPosts] = useState<boolean>(false);

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

        setIsLoggedIn(false);
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
    // setShown(true);
    setSettingsDialogVisible(true);
  };

  const handleShowSettingsMobile = (event: React.MouseEvent) => {
    event.stopPropagation();
    // setHidden(false);
    // setShown(true);
    setSettingsDialogVisible(true);
  };

  return (
    <div
      className="px-3 mb-3 relative"
      onClick={() => {
        setShowUserModal(true);
      }}
    >
      <UserModal
        visible={showUserModal}
        setVisible={setShowUserModal}
        isAdmin={isAdmin}
        showMyPosts={showMyPosts}
        handleShowSettings={handleShowSettings}
        handleShowSettingsMobile={handleShowSettingsMobile}
        handleLogout={handleLogout}
      />
      <SettingsDialog
        setVisible={setSettingsDialogVisible}
        visible={settingsDialogVisible}
      />

      <div className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-2 cursor-pointer rounded-lg">
        {userData && (
          <Avatar
            label={userData?.firstName[0] + userData?.lastName[0]}
            shape="circle"
            className="font-bold bg-blue-500 text-white"
          />
        )}

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
