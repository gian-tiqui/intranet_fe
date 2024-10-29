"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { decodeUserData, fetchMonitoringData } from "@/app/functions/functions";
import { DepartmentMonitoring } from "@/app/types/types";
import DepartmentUsers from "./DepartmentUsers";
import MonitoringLoading from "./MonitoringLoading";

const MonitoringMain = () => {
  const router = useRouter();
  const [dept, setDept] = useState<DepartmentMonitoring>();

  const {
    data: departments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["monitoring"],
    queryFn: fetchMonitoringData,
  });

  useEffect(() => {
    const deptName = decodeUserData()?.departmentCode;

    if (deptName) {
      if (!["hr", "qm", "admin"].includes(deptName.toLowerCase())) {
        toast("You are trying to access a restricted page.", {
          type: "error",
          className: toastClass,
        });
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    if (departments) setDept(departments[0]);
  }, [departments]);

  if (isError)
    return (
      <div className="text-center">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-sm font-semibold">Users / Read counts</h1>
      <h1 className="text-2xl font-bold mb-5">Monitoring Dashboard</h1>

      <div className="mb-5"></div>

      {isLoading ? (
        <MonitoringLoading />
      ) : (
        <DepartmentUsers
          department={dept}
          departments={departments}
          dept={dept}
          setDept={setDept}
        />
      )}
    </div>
  );
};

export default MonitoringMain;
