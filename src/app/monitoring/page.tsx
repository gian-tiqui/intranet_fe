import React from "react";
import MonitoringMain from "./components/MonitoringMain";
import AuthListener from "../components/AuthListener";

const Monitoring = () => {
  return (
    <div>
      <AuthListener />
      <MonitoringMain />
    </div>
  );
};

export default Monitoring;
