"use client";
import { INTRANET } from "@/app/bindings/binding";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardGuard = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem(INTRANET)) {
      const dept = localStorage.getItem(INTRANET);
      const decoded: { departmentName: string } = jwtDecode(dept || "");

      if (decoded.departmentName !== "ADMIN") router.push("/");
    }
  }, [router]);
  return <></>;
};

export default DashboardGuard;
