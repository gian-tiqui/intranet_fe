"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
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
import { useQuery } from "@tanstack/react-query";
import { findUserById, getLastLogin } from "../utils/service/userService";
import useRefetchUserStore from "../store/refetchUserData";

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
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    departmentName: string;
  } | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");

  const {
    data: userQueryData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`user-${userId}`],
    queryFn: () => findUserById(userId),
    enabled: !!userId,
  });

  const { setRefetch } = useRefetchUserStore();

  useEffect(() => {}, [userQueryData]);

  useEffect(() => {
    if (refetch) {
      setRefetch(refetch);
    }
  }, [refetch, setRefetch]);

  useEffect(() => {
    const userId = decodeUserData()?.sub;
    if (userId) setUserId(userId);
  }, []);

  const { data } = useQuery({
    queryKey: [`deptid-${userId}`],
    queryFn: () => getLastLogin(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data?.data?.lastLogin?.updatedAt) {
      const formattedDate = new Date(
        data.data.lastLogin.updatedAt
      ).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setDate(formattedDate);

      const hasSeenDialog = sessionStorage.getItem("hasSeenLastLoginDialog");
      if (!hasSeenDialog) {
        sessionStorage.setItem("hasSeenLastLoginDialog", "true");
      }
    }
  }, [data]);

  const router = useRouter();

  useEffect(() => {
    if (userQueryData) {
      setUserData({
        firstName: userQueryData.data.user.firstName,
        lastName: userQueryData.data.user.lastName,
        departmentName: userQueryData.data.user.department.departmentName,
      });

      if (userQueryData.data.user.department.departmentCode === "it")
        setIsAdmin(true);
      if (
        ["hr", "qm", "admin"].includes(
          userQueryData.data.user.department.departmentCode
        )
      )
        setShowMyPosts(true);
    }
  }, [userQueryData]);

  const handleLogout = async (event: React.MouseEvent) => {
    event.stopPropagation();

    const userId = decodeUserData()?.sub;

    if (userId) {
      try {
        await apiClient.post(`${API_BASE}/auth/logout`, {
          userId,
        });
      } catch (error) {
        console.error(error);
        const { message } = error as { message: string };
        toast(message, { type: "error", className: toastClass });
      } finally {
        setIsLoggedIn(false);
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
    <>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200/50 dark:border-gray-700/50"
      >
        {/* User Profile Section */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 p-3 hover:bg-white/70 dark:hover:bg-gray-800/70 cursor-pointer rounded-xl transition-all duration-300 backdrop-blur-sm"
          onClick={() => setShowUserModal(true)}
        >
          <div className="relative">
            {userData ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Avatar
                  label={userData.firstName[0] + userData.lastName[0]}
                  shape="circle"
                  className="font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  style={{ width: "40px", height: "40px" }}
                />
              </motion.div>
            ) : (
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
            )}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
          </div>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            ) : userData ? (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {`${userData.firstName} ${userData.lastName}`}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {userData.departmentName}
                </p>
                {date && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Last login: {date}
                  </p>
                )}
              </motion.div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                User not found
              </p>
            )}
          </div>

          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              icon="solar:alt-arrow-right-bold-duotone"
              className="h-4 w-4 text-gray-400 dark:text-gray-500"
            />
          </motion.div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 pt-3 border-t border-gray-200/30 dark:border-gray-700/30"
        >
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Online
              </span>
            </div>
            <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Active now
            </span>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default UserButton;
