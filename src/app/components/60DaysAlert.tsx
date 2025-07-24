import { useQuery } from "@tanstack/react-query";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef } from "react";
import { decodeUserData } from "../functions/functions";
import userId from "../store/userId";
import { findUserById } from "../utils/service/userService";
import CustomToast from "./CustomToast";

const SixtyDaysAlert = () => {
  const toastRef = useRef<Toast>(null);

  const { data: userQueryData } = useQuery({
    queryKey: [`user-${userId}`],
    queryFn: () => {
      const userId = decodeUserData()?.sub;
      return findUserById(userId);
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (userQueryData) {
      const now = new Date();
      const lastUpdated = new Date(userQueryData.data.user.lastUpdated);
      const dayDiff = Math.floor(
        (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff > 60) {
        toastRef?.current?.show({
          severity: "warn",
          summary: "Profile Update Reminder",
          detail: `It's been over ${dayDiff} days since your last profile update. Please consider updating your profile.`,
          life: 7000,
        });
      }
    }
  }, [userQueryData, toastRef]);
  return <CustomToast ref={toastRef} />;
};

export default SixtyDaysAlert;
