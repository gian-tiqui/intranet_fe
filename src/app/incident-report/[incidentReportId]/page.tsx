import React from "react";
import IncidentReportContainer from "../components/IncidentReportContainer";
import AuthListener from "@/app/components/AuthListener";

const IncidentReportPage = async ({
  params,
}: {
  params: { incidentReportId: string };
}) => {
  const { incidentReportId } = await params;
  const reportId = parseInt(incidentReportId, 10);

  if (isNaN(reportId)) {
    return <div>Invalid ID: {incidentReportId}</div>;
  }

  return (
    <>
      <AuthListener />
      <IncidentReportContainer incidentReportId={reportId} />
    </>
  );
};

export default IncidentReportPage;
