import { User } from "@/app/types/types";
import React from "react";
import UserItem from "./UserItem";

interface Props {
  pendingUsers: User[];
  onRefetch: () => void;
}

const UserList: React.FC<Props> = ({ pendingUsers, onRefetch }) => {
  const sortedUsers = [...pendingUsers].sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  const groupedUsers: { [key: string]: User[] } = {};
  sortedUsers.forEach((user) => {
    const firstLetter = user.firstName[0].toUpperCase();
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push(user);
  });

  return (
    <div className="flex flex-col gap-4">
      {Object.keys(groupedUsers)
        .sort()
        .map((letter) => (
          <div key={letter}>
            <h2 className="text-2xl font-bold mb-3 text-blue-700">{letter}</h2>
            <div className="flex flex-col bg-[#EEEEEE] py-1 rounded-xl shadow">
              {groupedUsers[letter].map((user, index) => (
                <UserItem
                  index={index}
                  key={user.id}
                  pendingUser={user}
                  onRefetch={onRefetch}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserList;
