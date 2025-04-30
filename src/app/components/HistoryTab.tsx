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
      <div className="px-6">
        <p>There was a problem in loading your history. Try again later</p>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="px-6">
        <p>Loading notifications...</p>
      </div>
    );

  return (
    <div className="h-[70vh] overflow-auto">
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
