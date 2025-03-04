import { UserMonitoring } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface Props {
  user: UserMonitoring;
}

const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="border dark:border-neutral-700 cursor-pointer p-3 transition duration-200 h-14 flex justify-between hover:bg-gray-100 dark:hover:bg-neutral-700">
      <div className="flex items-center h-full gap-2">
        <Icon icon={"material-symbols:error-outline"} className="h-5 w-5" />
        <p>
          {user.firstName} {user.lastName}
        </p>
      </div>

      <div className="flex items-center h-full gap-2">
        <p>Reads: {user.readCount}</p>
        <p>Unreads: {user.unreadCount}</p>
      </div>
    </div>
  );
};

export default UserCard;
