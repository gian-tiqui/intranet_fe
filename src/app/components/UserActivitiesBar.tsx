import { PrimeIcons } from "primereact/api";
import React from "react";
import useActivityBarStore from "../store/activitybar";
import { motion } from "framer-motion";
import { TabPanel, TabView } from "primereact/tabview";
import tabIndexStore from "../store/tabIndex";
import { TabType } from "../types/types";
import HistoryTab from "./HistoryTab";
import UnreadsTab from "./UnreadsTab";
import NotificationsTab from "./NotificationsTab";

const UserActivitiesBar = () => {
  const { setShowActivityBar } = useActivityBarStore();
  const { tabIndex, setTabIndex } = tabIndexStore();

  const tabs: TabType[] = [
    {
      component: <HistoryTab />,
      name: "History",
    },
    {
      component: <UnreadsTab />,
      name: "Unreads",
    },
    {
      component: <NotificationsTab />,
      name: "Notifications",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4,
      }}
      exit={{
        opacity: 0,
        x: 100,
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeInOut" },
      }}
      className="h-screen w-96 absolute right-0 bg-white/95 backdrop-blur-xl border-l border-gray-200/60 shadow-2xl z-20 overflow-hidden"
    >
      {/* Header with glassmorphism effect */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Activity Center
            </h2>
            <p className="text-sm text-gray-500">
              Stay updated with your activity
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowActivityBar(false)}
            className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center group"
          >
            <i
              className={`${PrimeIcons.ANGLE_DOUBLE_RIGHT} text-gray-600 group-hover:text-gray-800 transition-colors`}
            />
          </motion.button>
        </div>
      </div>

      {/* Modern TabView with custom styling */}
      <div className="flex-1 overflow-hidden">
        <TabView
          activeIndex={tabIndex}
          onTabChange={(e) => setTabIndex(e.index)}
          pt={{
            root: {
              className: "h-full flex flex-col",
            },
            nav: {
              className: "bg-transparent border-none px-6 pt-4 pb-2",
            },
            navContent: {
              className: "flex space-x-1 bg-gray-100 p-1 rounded-xl",
            },
            inkbar: {
              className: "hidden", // Hide default inkbar since we're using custom styling
            },
            panelContainer: {
              className: "flex-1 bg-transparent p-0 overflow-hidden",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <TabPanel
              key={index}
              header={tab.name}
              pt={{
                headerAction: {
                  className: `flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-none ${
                    tabIndex === index
                      ? "bg-white text-gray-900 shadow-sm"
                      : "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`,
                },
                content: {
                  className: "h-full p-0 overflow-hidden",
                },
              }}
            >
              <motion.div
                key={`tab-${index}-${tabIndex}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
              >
                {tab.component}
              </motion.div>
            </TabPanel>
          ))}
        </TabView>
      </div>

      {/* Subtle gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
    </motion.div>
  );
};

export default UserActivitiesBar;
