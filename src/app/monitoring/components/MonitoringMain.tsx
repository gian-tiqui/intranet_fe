"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { decodeUserData, fetchMonitoringData } from "@/app/functions/functions";
import { DepartmentMonitoring } from "@/app/types/types";
import DepartmentUsers from "./DepartmentUsers";

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
    const deptName = decodeUserData()?.departmentName;

    if (deptName) {
      if (!["hr", "qm"].includes(deptName.toLowerCase())) {
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

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return (
      <div className="text-center">
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Monitoring Dashboard</h1>
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-5">
        {departments?.map((department: DepartmentMonitoring) => (
          <div
            className="flex-1 h-12 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 transition duration-200 cursor-pointer"
            key={department.departmentId}
            onClick={() => setDept(department)}
          >
            <h2 className="font-semibold">{department.departmentName}</h2>
          </div>
        ))}
      </div>
      <DepartmentUsers department={dept} />
    </div>
  );
};

export default MonitoringMain;
