"use client";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { decodeUserData, fetchMonitoringData } from "@/app/functions/functions";
import { DepartmentMonitoring } from "@/app/types/types";

const MonitoringMain = () => {
  const router = useRouter();

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

  const {
    data: departments,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["monitoring"],
    queryFn: fetchMonitoringData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <div>
      <h1>Monitoring Data</h1>
      {departments?.map((department: DepartmentMonitoring) => (
        <div key={department.departmentId}>
          <h2>
            {department.departmentName} - Posts: {department.postCount}
          </h2>
          <ul>
            {department.users.map((user) => (
              <li key={user.userId}>
                {user.firstName} {user.lastName} - Read: {user.readCount},
                Unread: {user.unreadCount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MonitoringMain;
