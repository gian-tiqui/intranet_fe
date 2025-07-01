import { useQuery } from "@tanstack/react-query";
import React from "react";
import useHistory from "../custom-hooks/history";
import HistoryTabItem from "./HistoryTabItem";

const HistoryTab = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: useHistory,
  });

  if (isError) {
    console.error("There was a problem in loading the history", error);

    return (
      <div className="px-6 text-sm">
        <p>There was a problem in loading your history. Try again later</p>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="px-6 text-sm">
        <p className="">Loading notifications...</p>
      </div>
    );

  if (data?.length === 0) {
    return (
      <div className="px-6 text-sm">
        <p>You haven&apos;t read anything yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[70vh] overflow-x-hidden overflow-y-auto">
      <div className="flex gap-3">
        <div className="w-full flex flex-col">
          {data?.map((item, index) => (
            <HistoryTabItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryTab;
