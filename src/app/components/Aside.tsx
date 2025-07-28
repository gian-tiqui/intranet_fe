"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";

import UserButton from "./UserButton";
import { usePathname, useRouter } from "next/navigation";
import PostList from "../posts/components/PostList";
import useTokenStore from "../store/tokenStore";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import usePostIdStore from "../store/postId";
import apiClient from "../http-common/apiUrl";
import useReadStore from "../store/readStore";
import ConfirmModal from "./ConfirmModal";
import useDeptIdStore from "../store/deptIdStore";
import { Department } from "../utils/enums/enum";

interface Props {
  variants?: Variants;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobile: boolean;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  isActive?: boolean;
}

const Aside: React.FC<Props> = ({
  isCollapsed,
  setIsCollapsed,
  variants,
  isMobile,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { setToken } = useTokenStore();
  const [selectedVis, setSelectedVis] = useState<string>("dept");
  const { postId } = usePostIdStore();
  const { isRead, setIsRead } = useReadStore();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [_dest, setDest] = useState<string>("");
  const { deptId } = useDeptIdStore();
  const [userDeptId, setUserDeptId] = useState<number>();

  useEffect(() => {
    setUserDeptId(decodeUserData()?.deptId);
  }, []);

  const fetchReadStatus = async () => {
    if (!postId) return;

    try {
      const response = await apiClient.get(
        `${API_BASE}/monitoring/read-status?userId=${
          decodeUserData()?.sub
        }&postId=${postId}`
      );

      setIsRead(response.data.message === "Read");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem(INTRANET) || "");
  }, [setToken]);

  const handleClick = (dest: string) => {
    fetchReadStatus();

    const userDeptId = decodeUserData()?.deptId;

    if (pathname.includes("/posts/") && !isRead && deptId === userDeptId) {
      setDest(dest);
      setShowConfirmModal(true);
      setConfirmed(false);
    } else {
      router.push(dest);
    }
  };

  useEffect(() => {
    if (confirmed) {
      router.push(_dest);
      setShowConfirmModal(false);
      setConfirmed(false);
    }
  }, [confirmed, router, _dest]);

  useEffect(() => {
    if (isChecked) setSelectedVis("dept");
    else setSelectedVis("all");
  }, [isChecked]);

  // Navigation items configuration
  const getNavigationItems = (): NavigationItem[] => {
    const baseItems: NavigationItem[] = [
      {
        id: "home",
        label: "Home", // More professional than "Home"
        icon: "solar:home-2-bold-duotone",
        path: "/",
        isActive: pathname === "/",
      },
      {
        id: "bulletin",
        label: "General Bulletin", // Clearer than "General Bulletin"
        icon: "solar:global-bold-duotone",
        path: "/bulletin",
        isActive: pathname === "/bulletin",
      },
      {
        id: "departments",
        label: "Department Bulletin", // More specific than "Department Bulletin"
        icon: "solar:buildings-2-bold-duotone",
        path: "/departments-memo",
        isActive: pathname === "/departments-memo",
      },
      {
        id: "phone-directory",
        label: "Phone Directory", // Shorter, still clear
        icon: "solar:phone-bold-duotone",
        path: "/phone-directory",
        isActive: pathname === "/phone-directory",
      },
    ];

    if (userDeptId && userDeptId === Department.CUSTOMER_EXPERIENCE) {
      baseItems.push({
        id: "incident-report",
        label: "Incident Reports", // This is already good
        icon: "solar:buildings-2-bold-duotone", // Consider changing to "solar:warning-circle-bold-duotone"
        path: "/incident-report",
        isActive: pathname === "/incident-report",
      });
    }

    if (
      userDeptId &&
      [Department.HUMAN_RESOURCE, Department.QUALITY_MANAGEMENT].includes(
        userDeptId
      )
    ) {
      baseItems.push(
        {
          id: "my-posts",
          label: "My Publications", // More professional than "My Posts"
          icon: "solar:folder-with-files-bold-duotone",
          path: "/my-posts",
          isActive: pathname === "/my-posts",
        },
        {
          id: "pending-updates",
          label: "Approval Queue", // Much clearer than "Profiles for approval"
          icon: "solar:clipboard-check-bold-duotone", // Better icon for approval process
          path: "/pending-updates",
          isActive: pathname === "/pending-updates",
        }
      );
    }

    if (userDeptId && [Department.HUMAN_RESOURCE].includes(userDeptId)) {
      baseItems.push({
        id: "users",
        label: "User Management", // More descriptive than "Manage Users"
        icon: "solar:users-group-two-rounded-bold-duotone",
        path: "/users",
        isActive: pathname === "/users",
      });
    }

    return baseItems;
  };

  const NavigationButton: React.FC<{
    item: NavigationItem;
    onClick: () => void;
  }> = ({ item, onClick }) => (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className={`
        group relative flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ease-out
        ${
          item.isActive
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 transform translate-x-1"
            : "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-md hover:translate-x-1 text-gray-700 dark:text-gray-300"
        }
      `}
    >
      <div className="relative">
        <Icon
          icon={item.icon}
          className={`h-5 w-5 transition-all duration-300 ${
            item.isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
          } ${
            hoveredItem === item.id && !item.isActive ? "text-blue-500" : ""
          }`}
        />
        {item.badge && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </div>
      <span
        className={`font-medium text-sm transition-all duration-300 ${
          item.isActive ? "text-white" : ""
        } ${hoveredItem === item.id && !item.isActive ? "text-blue-500" : ""}`}
      >
        {item.label}
      </span>
      {item.isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute right-2 w-2 h-2 bg-white rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <div className="flex items-center gap-3 p-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
          ${checked ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}
        `}
      >
        <motion.span
          initial={false}
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="inline-block h-4 w-4 rounded-full bg-white shadow-sm"
        />
      </motion.button>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </div>
  );

  return (
    <>
      {showConfirmModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowConfirmModal(!showConfirmModal)}
          className="bg-black/60 backdrop-blur-sm w-full h-full absolute z-50 grid place-content-center"
        >
          <ConfirmModal
            setShowConfirmModal={setShowConfirmModal}
            setConfirmed={setConfirmed}
          />
        </motion.div>
      )}

      {/* DESKTOP VIEW */}
      <motion.aside
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={variants}
        className="hidden md:flex flex-col w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl h-full rounded-r-3xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Navigation
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={
              setIsCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined
            }
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Icon
              icon="solar:sidebar-minimalistic-bold"
              className="h-5 w-5 text-gray-600 dark:text-gray-400"
            />
          </motion.button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          <div className="space-y-1">
            {getNavigationItems().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavigationButton
                  item={item}
                  onClick={() => handleClick(item.path)}
                />
              </motion.div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
          </div>

          {/* Post Filter */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
            >
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Post Filter
              </h3>
              <ToggleSwitch
                checked={isChecked}
                onChange={setIsChecked}
                label="General Posts Only"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PostList
                selectedVis={selectedVis}
                isMobile={isMobile}
                onClick={handleClick}
              />
            </motion.div>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <UserButton isMobile={isMobile} />
        </div>
      </motion.aside>

      {/* MOBILE VIEW */}
      <motion.aside
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={variants}
        className="flex md:hidden absolute z-50 flex-col w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl h-full rounded-r-3xl"
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Menu
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={
              setIsCollapsed ? () => setIsCollapsed(!isCollapsed) : undefined
            }
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Icon
              icon="solar:close-circle-bold"
              className="h-6 w-6 text-gray-600 dark:text-gray-400"
            />
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-2 mb-6">
            {getNavigationItems().map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavigationButton
                  item={item}
                  onClick={() => {
                    handleClick(item.path);
                    if (setIsCollapsed) setIsCollapsed(!isCollapsed);
                  }}
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile Toggle */}
          <div className="mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <div className="flex justify-center">
                <div className="flex bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVis("all")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedVis === "all"
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon
                      icon="solar:global-bold-duotone"
                      className="h-4 w-4 mr-2 inline"
                    />
                    All
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVis("dept")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      selectedVis === "dept"
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                    }`}
                  >
                    <Icon
                      icon="solar:buildings-2-bold-duotone"
                      className="h-4 w-4 mr-2 inline"
                    />
                    Dept
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <PostList
            selectedVis={selectedVis}
            isMobile={isMobile}
            onClick={handleClick}
          />
        </div>

        {/* Mobile User Section */}
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <UserButton isMobile={isMobile} />
        </div>
      </motion.aside>
    </>
  );
};

export default Aside;
