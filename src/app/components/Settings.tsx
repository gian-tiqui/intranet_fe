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
  const [activeIndex, setActiveIndex] = useState(0);
  const { setHidden } = useNavbarVisibilityStore();

  const stopPropa = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOuterChange = () => {
    const userDept = decodeUserData()?.departmentName;
    if (userDept?.toLowerCase() !== "admin") setHidden(true);
    setShown(false);
  };

  const userData = decodeUserData();

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/70 to-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOuterChange}
    >
      <div
        className="w-full max-w-4xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50"
        onClick={stopPropa}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                {userData?.firstName?.[0]}
                {userData?.lastName?.[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Icon icon="mdi:office-building" className="w-4 h-4" />
                {userData?.departmentName}
              </p>
            </div>
          </div>

          <HoverBox className="group relative">
            <button
              onClick={() => setShown(false)}
              className="p-3 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 border border-transparent hover:border-red-200 dark:hover:border-red-800"
            >
              <Icon
                icon="material-symbols:close-rounded"
                className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 transition-colors"
              />
            </button>
          </HoverBox>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="flex space-x-2 border-b border-gray-200/50 dark:border-gray-700/50">
            {[
              {
                id: 0,
                icon: "mdi:account-circle-outline",
                label: "User Information",
              },
              { id: 1, icon: "mdi:lock-outline", label: "Password" },
              { id: 2, icon: "mdi:security", label: "Security Questions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveIndex(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                  activeIndex === tab.id
                    ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                    : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <Icon icon={tab.icon} className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <div className="min-h-[300px]">
            {activeIndex === 0 && (
              <div className="animate-in slide-in-from-right-5 duration-200">
                <UserInfo />
              </div>
            )}
            {activeIndex === 1 && (
              <div className="animate-in slide-in-from-right-5 duration-200">
                <Password />
              </div>
            )}
            {activeIndex === 2 && (
              <div className="animate-in slide-in-from-right-5 duration-200">
                <SecretQuestion />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
