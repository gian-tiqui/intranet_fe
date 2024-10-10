import { API_BASE, INTRANET } from "@/app/bindings/binding";
import apiClient from "@/app/http-common/apiUrl";
import userIdStore from "@/app/store/userId";
import { User } from "@/app/types/types";
import { formatDate } from "date-fns";
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
      className="w-96 bg-neutral-200 dark:bg-neutral-900 rounded-xl p-4 flex gap-2 flex-col items-center"
    >
      <div className="h-20 w-20 bg-gray-300 rounded-full"></div>
      <div className="flex w-full justify-between">
        <p>First name</p>
        <p>{user?.firstName}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Middle name</p>
        <p>{user?.middleName}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Last name</p>
        <p>{user?.lastName}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Gender</p>
        <p>{user?.gender}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Address</p>
        <p>{user?.address}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Email</p>
        <p>{user?.email}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Department</p>
        <p>{user?.department.departmentName}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Created</p>
        <p>{user?.dob && formatDate(user?.createdAt, "MMMM dd, yyyy")}</p>
      </div>
      <div className="flex w-full justify-between">
        <p>Updated</p>
        <p>{user?.dob && formatDate(user?.updatedAt, "MMMM dd, yyyy")}</p>
      </div>
    </div>
  );
};

export default ViewUserData;
