"use client";
import { decodeUserData } from "@/app/functions/functions";
import { toastClass } from "@/app/tailwind-classes/tw_classes";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const Deactivation = () => {
  const router = useRouter();

  useEffect(() => {
    const validateRole = () => {
      const deptId = decodeUserData()?.deptId;

      if (deptId && deptId !== 3) {
        toast("You are not authorized to view this page.", {
          className: toastClass,
          type: "error",
        });

        router.push("/bulletin");
        return;
      }
    };

    validateRole();
  }, [router]);

  return <div></div>;
};

export default Deactivation;
