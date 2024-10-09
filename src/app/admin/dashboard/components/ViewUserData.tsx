import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import userIdStore from "@/app/store/userId";
import { User } from "@/app/types/types";
import React, { useEffect, useState } from "react";

const ViewUserData = () => {
  const [user, setUser] = useState<User | undefined>();
  const { selectedId } = userIdStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(
          `${API_BASE}/users/${selectedId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(INTRANET)}`,
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [selectedId]);

  return <div>{JSON.stringify(user, null, 2)}</div>;
};

export default ViewUserData;
