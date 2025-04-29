import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import React from "react";
import useActivityBarStore from "../store/activitybar";
import tabIndexStore from "../store/tabIndex";

interface Props {
  showPendingUsers: boolean;
}

const HeaderIcons: React.FC<Props> = () => {
  const { setShowActivityBar } = useActivityBarStore();
  const { setTabIndex } = tabIndexStore();

  return (
    <div className="flex items-center gap-4">
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
    </div>
  );
};

export default HeaderIcons;
