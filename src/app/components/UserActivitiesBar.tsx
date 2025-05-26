import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
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
  const { tabIndex } = tabIndexStore();
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
      initial={{ opacity: 0, x: 70 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0, duration: 0.3, ease: "easeInOut" }}
      exit={{ opacity: 0, x: 70 }}
      className="h-screen w-96 absolute right-0 bg-[#EEEEEE] shadow-lg z-20 pt-6"
    >
      <Button
        className="h-7 w-7 ms-6 mb-10"
        onClick={() => setShowActivityBar(false)}
        icon={`${PrimeIcons.ANGLE_DOUBLE_RIGHT} text-xl`}
      />
      <TabView
        activeIndex={tabIndex}
        pt={{
          panelContainer: { className: "h-[452px] bg-inherit p-0 pe-1 py-1" },
          nav: { className: "bg-inherit border-b border-black" },
        }}
      >
        {tabs.map((tab, index) => (
          <TabPanel
            key={index}
            pt={{
              headerAction: { className: "bg-inherit text-xs" },
              content: { className: "pt-3" },
            }}
            header={tab.name}
          >
            {tab.component}
          </TabPanel>
        ))}
      </TabView>
    </motion.div>
  );
};

export default UserActivitiesBar;
