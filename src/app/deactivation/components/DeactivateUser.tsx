"use client";
import useUserStore from "@/app/store/userStore";
import { User } from "@/app/types/types";
import React from "react";

interface Props {
  user: User;
}

const DeactivateUser: React.FC<Props> = ({ user }) => {
  const { setUser } = useUserStore();

  return (
    <div
      onClick={() => setUser(null)}
      className="absolute z-50 w-full h-screen bg-black/80 grid place-content-center"
    >
      <div className="w-80 bg-white" onClick={(e) => e.stopPropagation()}>
        {" "}
        {user.firstName}
      </div>
    </div>
  );
};

export default DeactivateUser;
