import useNotifications from "@/app/custom-hooks/notifications";
import React from "react";

const Notifications = () => {
  const notifications = useNotifications();
  return (
    <div className="w-full h-screen overflow-auto">
      <div className="w-full h-20 border-b border-gray-300 dark:border-neutral-900 flex justify-between px-6 items-center">
        <div></div>
      </div>

      <div className="w-full p-3 grid grid-cols-1  gap-1">
        {notifications.map((notification) => (
          <pre key={notification.id}>
            {JSON.stringify(notification, null, 2)}
          </pre>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
