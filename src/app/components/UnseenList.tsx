import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchUserUnreads } from "../functions/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import NotificationSkeleton from "./NotificationSkeleton";
import UnseenItem from "./UnseenItem";

const UnseenList = () => {
  const {
    data: unreads,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["unreads"],
    queryFn: fetchUserUnreads,
  });

  return (
    <div className="flex pb-1 h-64 shadow flex-col items-center w-64 absolute right-0 bg-neutral-200 dark:bg-neutral-800 rounded-xl border border-gray-300 top-8 dark:border-black">
      <div className="flex items-center justify-between w-full px-3 pt-2 border-b pb-2 mb-5 bg-white rounded-t-xl dark:bg-neutral-900 dark:border-black">
        <p className="font-bold">Posts you haven&apos;t read</p>
        <Icon icon={"gridicons:cross"} className="h-4 w-4" />
      </div>

      <div className="flex flex-col items-center px-1 w-full gap-1 overflow-auto">
        {isLoading && (
          <>
            {Array(2)
              .fill(0)
              .map((_, index) => (
                <NotificationSkeleton key={index} />
              ))}
          </>
        )}
        {isError && <p>Error loading notifications</p>}
        {unreads &&
          unreads?.map((item, index) => <UnseenItem key={index} item={item} />)}
      </div>
    </div>
  );
};

export default UnseenList;
