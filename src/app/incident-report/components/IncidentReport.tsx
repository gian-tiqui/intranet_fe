"use client";
import { Query } from "@/app/types/types";
import { getIncidentReport } from "@/app/utils/service/incidentReportService";
import { useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import IncidentReportDialog from "./IncidentReportDialog";

const IncidentReport = () => {
  const [query] = useState<Query>({ search: "", skip: 0, take: 1000 });
  const [visible, setVisible] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: [`incident-reports`],
    queryFn: () => getIncidentReport(query),
  });

  useEffect(() => {
    console.log(data?.data);
  }, [data]);

  return (
    <>
      <IncidentReportDialog visible={visible} setVisible={setVisible} />
      <div>
        <Button
          onClick={() => setVisible(true)}
          className="bg-blue-600 text-white w-32 font-medium justify-center h-8"
        >
          Report
        </Button>
      </div>
    </>
  );
};

export default IncidentReport;
