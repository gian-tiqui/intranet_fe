import { User } from "@/app/types/types";
import React from "react";
import UserItem from "./UserItem";

interface Props {
  pendingUsers: User[];
  onRefetch: () => void;
}

const UserList: React.FC<Props> = ({ pendingUsers, onRefetch }) => {
  return (
    <div className="flex flex-col gap-2">
      {pendingUsers.map((pendingUser) => (
        <UserItem
          key={pendingUser.id}
          pendingUser={pendingUser}
          onRefetch={onRefetch}
        />
      ))}
    </div>
  );
};

export default UserList;
