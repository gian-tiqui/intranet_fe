import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserUnreads } from "../functions/functions";
import UnseenList from "./UnseenList";

const Unread = () => {
  const { data: unreads, isLoading } = useQuery({
    queryKey: ["unreads"],
    queryFn: fetchUserUnreads,
  });

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
        className="relative h-10 w-10 cursor-pointer"
        onClick={handleOpenNotifs}
      >
        <Icon icon={"material-symbols:post-outline"} className="h-8 w-8" />
        <p className="absolute bottom-0 right-0 px-2 py-1 font-extrabold bg-black dark:bg-white text-white rounded-full dark:text-black text-[10px]">
          {isLoading ? <Icon icon={"line-md:loading-loop"} /> : unreads?.length}
        </p>
      </div>
      {openNotifs && <UnseenList />}
    </div>
  );
};

export default Unread;
