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
  const [settingsDialogVisible, setSettingsDialogVisible] = useState(false);
  const { setShowLogoutArt } = useLogoutArtStore();
  const { setHidden } = useNavbarVisibilityStore();
  const { setIsLoggedIn } = useLoginStore();
  const [showUserModal, setShowUserModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    departmentName: string;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const data = decodeUserData();
    if (data) {
      setUserData(data);
      const dept = data.departmentCode?.toLowerCase();
      if (dept === "it") setIsAdmin(true);
      if (["hr", "qm", "admin"].includes(dept)) setShowMyPosts(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = async (event: React.MouseEvent) => {
    event.stopPropagation();

    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        const response = await apiClient.post(`${API_BASE}/auth/logout`, {
          userId,
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

    setShowLogoutArt(true);
    setHidden(false);
    Cookies.remove(INTRANET);
    localStorage.removeItem(INTRANET);
    router.push("/login");
  };

  const handleShowSettings = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSettingsDialogVisible(true);
  };

  const handleShowSettingsMobile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSettingsDialogVisible(true);
  };

  return (
    <div className="px-3 mb-3">
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
        visible={settingsDialogVisible}
        setVisible={setSettingsDialogVisible}
      />

      <div
        className="flex items-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-2 cursor-pointer rounded-lg"
        onClick={() => setShowUserModal(true)}
      >
        {userData && (
          <Avatar
            label={userData.firstName[0] + userData.lastName[0]}
            shape="circle"
            className="font-bold bg-blue-500 text-white"
          />
        )}
        <div>
          {loading ? (
            <p className="text-sm">Loading...</p>
          ) : userData ? (
            <>
              <p className="text-sm">
                {`${userData.firstName} ${userData.lastName}`}
              </p>
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
