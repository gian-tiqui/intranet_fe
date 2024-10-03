import { User } from "@/app/types/types";
import React from "react";

interface Props {
  user: User;
}

const UserCard: React.FC<Props> = (user) => {
  return (
    <div className="rounded bg-neutral-600 w-full p-4 shadow">
      <div className="flex justify-between w-full">
        <p>
          {user.user.firstName} {user.user.lastName}
        </p>
        <p>{user.user.deptId}</p>
      </div>
    </div>
  );
};

export default UserCard;
