import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";
import useActivityBarStore from "../store/activitybar";
import tabIndexStore from "../store/tabIndex";
import { motion } from "motion/react";

interface Props {
  showPendingUsers: boolean;
}

const HeaderIcons: React.FC<Props> = () => {
  const { setShowActivityBar } = useActivityBarStore();
  const { setTabIndex } = tabIndexStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="flex items-center gap-4"
    >
      <Button
        tooltip="History"
        tooltipOptions={{ position: "bottom" }}
        onClick={() => {
          setTabIndex(0);
          setShowActivityBar(true);
        }}
        icon={`${PrimeIcons.CLOCK} text-xl`}
        className="h-7 w-7"
      />
      <Button
        tooltip="Unreads"
        tooltipOptions={{ position: "bottom" }}
        onClick={() => {
          setTabIndex(1);
          setShowActivityBar(true);
        }}
        icon={`${PrimeIcons.BOOK} text-xl`}
        className="h-7 w-7"
      />
      <Button
        tooltip="Notifications"
        tooltipOptions={{ position: "left" }}
        onClick={() => {
          setTabIndex(2);
          setShowActivityBar(true);
        }}
        icon={`${PrimeIcons.BELL} text-xl`}
        className="h-7 w-7"
      />
    </motion.div>
  );
};

export default HeaderIcons;
