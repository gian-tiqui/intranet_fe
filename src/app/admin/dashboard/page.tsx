import React from "react";
import DashboardGuard from "./components/DashboardGuard";
import DashboardMain from "./components/DashboardMain";

const page = () => {
  return (
    <>
      <DashboardGuard />
      <DashboardMain />
    </>
  );
};

export default page;
