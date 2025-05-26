import { useQuery } from "@tanstack/react-query";
import React from "react";
import Notification from "./Notification";
import { fetchNotifs } from "../functions/functions";

const HistoryTab = () => {
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifs,
  });

  if (isError) {
    console.error("There was a problem in loading the history", error);

    return (
      <div className="px-6">
        <p>
          There was a problem in loading your notifications. Try again later
        </p>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="px-6">
        <p>Loading notifications...</p>
      </div>
    );

  if (notifications?.length === 0) {
    return (
      <div className="px-6 text-sm">
        <p>No notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-auto">
      <div className="flex gap-3">
        <div className="w-full flex flex-col">
          {notifications?.map((item, index) => (
            <Notification key={index} notification={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
