"use client";
import { fetchLogsByTypeId } from "@/app/functions/functions";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const UserEditLogs = () => {
  const {
    data: userLogs,
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["user-logs"],
    queryFn: () => fetchLogsByTypeId(3),
  });

  if (isError) console.error(error);

  if (isLoading) return <p>loading...</p>;

  return (
    <div className="p-20">
      {userLogs && userLogs?.length > 0
        ? JSON.stringify(userLogs)
        : "No logs yet"}
    </div>
  );
};

export default UserEditLogs;
