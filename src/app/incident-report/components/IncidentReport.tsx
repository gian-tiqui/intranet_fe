"use client";
import { Button } from "primereact/button";
import React, { useState } from "react";
import IncidentReportDialog from "./IncidentReportDialog";
import { TabPanel, TabView } from "primereact/tabview";
import IncidentReportTable from "./IncidentReportTable";

const IncidentReport = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const tabPanels: { header: string; statusId: number }[] = [
    { header: "New", statusId: 1 },
    { header: "Viewed", statusId: 2 },
    { header: "Forwarded", statusId: 3 },
    { header: "Seen", statusId: 4 },
    { header: "Sent", statusId: 5 },
    { header: "Sanctioned", statusId: 6 },
  ];

  return (
    <>
      <IncidentReportDialog visible={visible} setVisible={setVisible} />
      <div className="w-full md:h-[86vh]">
        <header className="p-4">
          <Button
            onClick={() => setVisible(true)}
            className="bg-blue-600 text-white w-32 font-medium justify-center h-8"
          >
            Report
          </Button>
        </header>
        <div className="p-4">
          <TabView>
            {tabPanels.map((tabPanel, index: number) => (
              <TabPanel header={tabPanel.header} key={index}>
                <IncidentReportTable statusId={tabPanel.statusId} />
              </TabPanel>
            ))}
          </TabView>
        </div>
      </div>
    </>
  );
};

export default IncidentReport;
