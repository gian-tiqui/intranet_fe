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

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="h-96 w-96 bg-neutral-200 dark:bg-neutral-900 rounded-xl p-4"
    >
      {user?.firstName}
    </div>
  );
};

export default ViewUserData;
