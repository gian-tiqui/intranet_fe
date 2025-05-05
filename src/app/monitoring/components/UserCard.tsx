import { UserMonitoring } from "@/app/types/types";
import { PrimeIcons } from "primereact/api";
import { Avatar } from "primereact/avatar";
import React from "react";

interface Props {
  user: UserMonitoring;
  index: number;
}

const UserCard: React.FC<Props> = ({ user, index }) => {
  return (
    <div
      className={`w-full flex items-center ${
        index !== 0 && "border-t"
      } border-gray-300`}
    >
      <div className="w-full flex items-center gap-4 text-xl ps-5 py-5">
        <Avatar
          shape="circle"
          className="bg-blue-600 h-12 w-12 text-white font-bold text-xl"
          label={
            user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase()
          }
        />
        <div className="flex gap-2 text-lg font-semibold">
          <p>{user.firstName}</p>
          <p>{user.lastName}</p>
        </div>
      </div>
      <div className="flex gap-4 w-full justify-end pe-5 text-sm font-medium text-gray-700 dark:text-gray-300">
        <div className="px-5 rounded-full flex items-center gap-2 bg-blue-500 text-white font-medium h-9">
          <i className={`${PrimeIcons.BOOK} text-md`}></i>
          <p>Reads</p>
          <div>
            <p>{user.readCount}</p>
          </div>
        </div>
        <div className="px-5 rounded-full flex items-center gap-2 bg-blue-500 text-white font-medium h-9">
          <i className={`${PrimeIcons.TIMES_CIRCLE}`}></i>
          <p>Missing</p>
          <div>
            <p>{user.unreadCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
