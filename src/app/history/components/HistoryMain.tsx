"use client";
import useHistory from "@/app/custom-hooks/history";
import React from "react";

const HistoryMain = () => {
  const userHistory = useHistory();

  return <div>{JSON.stringify(userHistory, null, 2)}</div>;
};

export default HistoryMain;
