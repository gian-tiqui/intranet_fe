import { useEffect, useState } from "react";
import { API_BASE } from "../bindings/binding";
import { decodeUserData } from "../functions/functions";
import apiClient from "../http-common/apiUrl";
import { NotificationType } from "../types/types";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const API_URI = `${API_BASE}/notification?deptId=${
          decodeUserData()?.deptId
        }&userId=${decodeUserData()?.sub}`;
        const response = await apiClient.get(API_URI);

        setNotifications(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifs();
  }, []);

  return notifications;
};

export default useNotifications;
