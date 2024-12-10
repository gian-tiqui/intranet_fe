"use client";
import { API_BASE } from "@/app/bindings/binding";
import { decodeUserData } from "@/app/functions/functions";
import apiClient from "@/app/http-common/apiUrl";
import useUserStore from "@/app/store/userStore";
import { User } from "@/app/types/types";
import React, { useState } from "react";

interface Props {
  user: User;
}

const DeactivateUser: React.FC<Props> = ({ user }) => {
  const { setUser } = useUserStore();
  const [password] = useState<string>("password1");

  const handleClick = async () => {
    const deactivatorId = decodeUserData()?.sub;

    try {
      const response = await apiClient.post(
        `${API_BASE}/users/deactivate?password=${password}&deactivatorId=${deactivatorId}&employeeId=${user.employeeId}`
      );

      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      onClick={() => setUser(null)}
      className="absolute z-50 w-full h-screen bg-black/80 grid place-content-center"
    >
      <div className="w-80 bg-white" onClick={(e) => e.stopPropagation()}>
        {" "}
        deactivate {user.firstName}?<button onClick={handleClick}>ok</button>
      </div>
    </div>
  );
};

export default DeactivateUser;
