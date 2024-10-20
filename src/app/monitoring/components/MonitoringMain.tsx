"use client";
import { decodeUserData } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

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
  return <div>hi</div>;
};

export default MonitoringMain;
