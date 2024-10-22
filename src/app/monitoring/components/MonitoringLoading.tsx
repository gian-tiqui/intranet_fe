import React from "react";

const MonitoringLoading = () => {
  return (
    <div className="h-96 mt-1">
      <div className="w-full flex justify-between items-center mb-2">
        <div className="w-1/3 bg-gray-300 animate-pulse rounded h-10"></div>
        <div className="w-1/3 bg-gray-300 animate-pulse rounded h-10"></div>
      </div>
      <div className="h-80 w-full bg-gray-300 animate-pulse rounded-lg"></div>
    </div>
  );
};

export default MonitoringLoading;
