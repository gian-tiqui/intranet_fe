"use client";
import { INTRANET } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import useNavbarVisibilityStore from "@/app/store/navbarVisibilityStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashboardGuard = () => {
  // Navbar visibility setter.
  const { setHidden } = useNavbarVisibilityStore();
  const router = useRouter();
  useEffect(() => {
    // Verify if access token exists.
    const at = localStorage.getItem(INTRANET);

    if (at) {
      // Retrieve the department name via access token.
      const deptName = decodeUserData()?.departmentCode;

      // Do not allow the user to go to the dashboard if he is not an admin.
      if (deptName !== "ADMIN") router.push("/");
      else setHidden(false);
    }
  }, [router, setHidden]);
  return <></>;
};

export default DashboardGuard;
