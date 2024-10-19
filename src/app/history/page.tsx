import React from "react";
import AuthListener from "../components/AuthListener";
import HistoryMain from "./components/HistoryMain";

const page = () => {
  return (
    <div>
      <AuthListener />
      <HistoryMain />
    </div>
  );
};

export default page;
