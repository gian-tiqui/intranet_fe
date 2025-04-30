import Notification from "@/app/components/Notification";
import useNotifications from "@/app/custom-hooks/notifications";
import React from "react";

const Notifications = () => {
  const notifications = useNotifications();
  return (
    <div className="w-full h-screen overflow-auto">
      <div className="w-full p-3 grid grid-cols-1  gap-1">
        {notifications.map((notification) => (
          <Notification notification={notification} key={notification.id} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
