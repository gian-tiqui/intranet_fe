import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserUnreads } from "../functions/functions";
import UnseenList from "./UnseenList";
import useSignalStore from "../store/signalStore";

const Unread = () => {
  const {
    data: unreads,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["unreads"],
    queryFn: fetchUserUnreads,
  });

  const { signal, setSignal } = useSignalStore();

  useEffect(() => {
    refetch();
    setSignal(false);
  }, [refetch, signal, setSignal]);

  const [openNotifs, setOpenNotifs] = useState<boolean>(false);

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
        className="relative h-8 w-8 cursor-pointer grid place-content-center hover:bg-neutral-300 rounded dark:hover:bg-neutral-700"
        onClick={handleOpenNotifs}
      >
        <Icon icon={"material-symbols:post-outline"} className="h-6 w-6" />
        <p className="absolute -bottom-1 -right-1 h-4 w-4 font-extrabold grid place-content-center bg-black dark:bg-white text-white rounded-full dark:text-black text-[10px]">
          {isLoading ? <Icon icon={"line-md:loading-loop"} /> : unreads?.length}
        </p>
      </div>
      {openNotifs && <UnseenList />}
    </div>
  );
};

export default Unread;
