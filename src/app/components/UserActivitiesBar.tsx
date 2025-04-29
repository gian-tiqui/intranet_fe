import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";
import useActivityBarStore from "../store/activitybar";
import { motion } from "framer-motion";
import { TabPanel, TabView } from "primereact/tabview";
import tabIndexStore from "../store/tabIndex";

const UserActivitiesBar = () => {
  const { setShowActivityBar } = useActivityBarStore();
  const { tabIndex } = tabIndexStore();

  return (
    <motion.div className="h-screen w-96 absolute right-0 bg-[#EEEEEE] shadow-lg z-20 pt-6">
      <Button
        className="h-7 w-7 ms-6 mb-10"
        onClick={() => setShowActivityBar(false)}
        icon={`${PrimeIcons.ANGLE_DOUBLE_RIGHT} text-xl`}
      />
      <TabView
        activeIndex={tabIndex}
        pt={{
          panelContainer: { className: "h-[452px] bg-inherit" },
          nav: { className: "bg-inherit border-b border-black" },
        }}
      >
        <TabPanel
          pt={{ headerAction: { className: "bg-inherit" } }}
          header="History"
        >
          history
        </TabPanel>
        <TabPanel
          header="Unreads"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          unreads
        </TabPanel>
        <TabPanel
          header="Notifications"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          notifications
        </TabPanel>
      </TabView>
    </motion.div>
  );
};

export default UserActivitiesBar;
