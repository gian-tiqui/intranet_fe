import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import NotifcationList from "./NotifcationList";
import { useQuery } from "@tanstack/react-query";
import { fetchNotifs } from "../functions/functions";
import { NotificationType } from "../types/types";
import useSignalStore from "../store/signalStore";

const NotificationBell = () => {
  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifs,
  });
  const [openNotifs, setOpenNotifs] = useState<boolean>(false);
  const { signal, setSignal } = useSignalStore();

  useEffect(() => {
    refetch();
    setSignal(false);
  }, [signal, setSignal, refetch]);

  const countUnreadNotifs = (notifs: NotificationType[]) => {
    if (notifs?.length === 0) return 0;

    const count = notifs.filter((notif) => notif.isRead === false).length;

    return count;
  };

  const handleOpenNotifs = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenNotifs((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (openNotifs) {
        setOpenNotifs(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [openNotifs]);

  return (
    <div className="relative">
      <div
        className="relative h-2 w-2 cursor-pointer grid place-content-center hover:bg-neutral-300 rounded dark:hover:bg-neutral-700"
        onClick={handleOpenNotifs}
      >
        <Icon icon={"mdi:bell-outline"} className="h-7 w-7" />
        <p className="absolute -bottom-3 -right-3 h-4 w-4 grid place-content-center font-extrabold bg-black dark:bg-white text-white rounded-full dark:text-black text-[10px]">
          {isLoading ? (
            <Icon icon={"line-md:loading-loop"} />
          ) : (
            countUnreadNotifs(notifications ? notifications : [])
          )}
        </p>
      </div>
      {openNotifs && <NotifcationList />}
    </div>
  );
};

export default NotificationBell;
