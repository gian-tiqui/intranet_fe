import React from "react";
import IncidentReport from "./components/IncidentReport";
import AuthListener from "../components/AuthListener";

const IncidentReportPage = () => {
  return (
    <>
      <AuthListener />
      <IncidentReport />
    </>
  );
};

export default IncidentReportPage;
