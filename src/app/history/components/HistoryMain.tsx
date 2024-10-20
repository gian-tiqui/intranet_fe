"use client";
import useHistory from "@/app/custom-hooks/history";
import React from "react";
import HistoryList from "./HistoryList";

const HistoryMain = () => {
  const userHistory = useHistory();

  return (
    <div>
      <HistoryList history={userHistory} />
    </div>
  );
};

export default HistoryMain;
