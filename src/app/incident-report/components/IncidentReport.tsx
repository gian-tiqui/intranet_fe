"use client";
import React, { useEffect, useState } from "react";
import IncidentReportTable from "./IncidentReportTable";
import { decodeUserData } from "@/app/functions/functions";
import { useRouter } from "next/navigation";

const IncidentReport = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const decoded = decodeUserData();

    if (decoded) {
      if (decoded.deptId !== 10) router.push("/");
    }
  }, [router]);

  const tabPanels: {
    header: string;
    statusId: number;
    icon: string;
    color: string;
    description: string;
  }[] = [
    {
      header: "New",
      statusId: 1,
      icon: "pi-plus-circle",
      color: "bg-blue-500",
      description: "Recently submitted reports",
    },
    {
      header: "Viewed",
      statusId: 2,
      icon: "pi-eye",
      color: "bg-purple-500",
      description: "Reports that have been reviewed",
    },
    {
      header: "Forwarded",
      statusId: 3,
      icon: "pi-arrow-right",
      color: "bg-orange-500",
      description: "Reports forwarded to departments",
    },
    {
      header: "Seen",
      statusId: 4,
      icon: "pi-check",
      color: "bg-green-500",
      description: "Reports acknowledged by departments",
    },
    {
      header: "Sent",
      statusId: 5,
      icon: "pi-send",
      color: "bg-teal-500",
      description: "Reports sent for further action",
    },
    {
      header: "Sanctioned",
      statusId: 6,
      icon: "pi-shield",
      color: "bg-red-500",
      description: "Reports with applied sanctions",
    },
  ];

  const getTabCount = (statusId: number) => {
    // This would typically come from your data/API
    // For now, returning placeholder counts
    const counts = {
      1: 12, // New
      2: 8, // Viewed
      3: 15, // Forwarded
      4: 6, // Seen
      5: 3, // Sent
      6: 2, // Sanctioned
    };
    return counts[statusId as keyof typeof counts] || 0;
  };

  return (
    <div className="w-full overflow-hidden p-4">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Incident Reports
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage incident reports across all departments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {tabPanels.reduce(
                  (sum, tab) => sum + getTabCount(tab.statusId),
                  0
                )}
              </div>
              <div className="text-xs text-gray-500">Total Reports</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 px-6">
        <div className="flex space-x-1 py-4">
          {tabPanels.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200
                ${
                  activeIndex === index
                    ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }
              `}
            >
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white text-xs
                ${activeIndex === index ? tab.color : "bg-gray-400"}
              `}
              >
                <i className={`pi ${tab.icon}`}></i>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{tab.header}</span>
                <span className="text-xs opacity-75">
                  {getTabCount(tab.statusId)} reports
                </span>
              </div>
              {activeIndex === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content with Animation */}
      <div className="p-6 bg-gray-50 min-h-[calc(100vh-200px)]">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`
              w-10 h-10 rounded-lg flex items-center justify-center text-white
              ${tabPanels[activeIndex].color}
            `}
            >
              <i className={`pi ${tabPanels[activeIndex].icon} text-lg`}></i>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {tabPanels[activeIndex].header} Reports
              </h2>
              <p className="text-sm text-gray-600">
                {tabPanels[activeIndex].description}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300 ease-in-out">
          <IncidentReportTable statusId={tabPanels[activeIndex].statusId} />
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .p-tabview .p-tabview-nav {
          display: none;
        }

        .p-tabview .p-tabview-panels {
          padding: 0;
          border: none;
          background: transparent;
        }

        .p-tabview .p-tabview-panel {
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default IncidentReport;
