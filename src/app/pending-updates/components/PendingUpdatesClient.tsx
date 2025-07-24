"use client";
import { getAllUserUpdates } from "@/app/utils/service/userUpdatesService";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const PendingUpdatesClient = () => {
  const { data } = useQuery({
    queryKey: ["user-updates"],
    queryFn: () => getAllUserUpdates(),
  });
  return <div>{JSON.stringify(data?.data.userUpdates)}</div>;
};

export default PendingUpdatesClient;
