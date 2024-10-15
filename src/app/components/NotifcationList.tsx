import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Notification from "./Notification";
import useNotifications from "../custom-hooks/notifications";

const NotifcationList = () => {
  const notifications = useNotifications();

  return (
    <div className="flex h-64 shadow flex-col items-center w-64 absolute right-0 bg-neutral-200 dark:bg-neutral-800 rounded-xl border border-gray-300 top-8 dark:border-black">
      <div className="flex items-center justify-between w-full px-3 pt-2 border-b pb-2 mb-5 bg-white rounded-t-xl dark:bg-neutral-900 dark:border-black">
        <p className="font-bold">Notifications</p>
        <Icon icon={"gridicons:cross"} className="h-4 w-4" />
      </div>
      <div className="flex flex-col items-center px-1 w-full gap-1 overflow-auto">
        {notifications.map((notif, index) => (
          <Notification notification={notif} key={index} />
        ))}
      </div>
    </div>
  );
};

export default NotifcationList;
