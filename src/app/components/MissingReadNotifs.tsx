"use client";
import { useEffect } from "react";
import apiClient from "../http-common/apiUrl";
import { API_BASE, INTRANET } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import { toast } from "react-toastify";
import { toastClass } from "../tailwind-classes/tw_classes";

const MissingReadNotifs = () => {
  useEffect(() => {
    const fetchReads = async () => {
      const response = await apiClient.post(
        `${API_BASE}/notification/user-reads`,
        {
          userId: decodeUserData()?.sub,
          deptId: decodeUserData()?.deptId,

          headers: {
            Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
          },
        }
      );

      if (!response.data.readAll) {
        toast(response.data.message, { type: "error", className: toastClass });
      }
    };

    fetchReads();
  }, []);

  return null;
};

export default MissingReadNotifs;
