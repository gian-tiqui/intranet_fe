import React from "react";
import DashboardGuard from "./components/DashboardGuard";

const page = () => {
  return (
    <div className="w-full h-screen bg-neutral-800">
      <DashboardGuard />
    </div>
  );
};

export default page;
