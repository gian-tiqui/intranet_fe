import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchUserUnreads } from "../functions/functions";
import UnreadItem from "./UnreadItem";

const UnreadsTab = () => {
  const {
    data: unreads,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["unreads"],
    queryFn: fetchUserUnreads,
  });
  if (isError) {
    console.error("There was a problem in loading the history", error);

    return (
      <div className="px-6">
        <p>There was a problem in loading your unreads. Try again later</p>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="px-6">
        <p>Loading unreads...</p>
      </div>
    );

  return (
    <div className="h-[70vh] overflow-auto">
      <div className="flex gap-3">
        <div className="w-full flex flex-col">
          {unreads?.map((item, index) => (
            <UnreadItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnreadsTab;
