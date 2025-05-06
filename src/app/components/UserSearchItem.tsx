import React from "react";
import { User } from "../types/types";
import { PrimeIcons } from "primereact/api";
import useUserProfileStore from "../store/userProfileStore";
import useUserIdStore from "../store/userIdStore";

interface Props {
  user: User;
  handleClose: () => void;
  type: string;
  index: number;
}

const UserSearchItem: React.FC<Props> = ({ user, type, index }) => {
  const { setUserProfileVisible } = useUserProfileStore();
  const { setUserId } = useUserIdStore();

  const handleClick = () => {
    setUserId(user.id);
    setUserProfileVisible(true);
  };

  return (
    <div
      onClick={handleClick}
      className={`h-16 cursor-pointer w-full flex items-center justify-between px-5 ${
        index !== 0 && "border-t"
      } border-black`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-full grid place-content-center">
          <i className={`${PrimeIcons.USER} text-xl text-white`}></i>
        </div>

        <p className="font-semibold">
          {user.firstName} {user.lastName}
        </p>
      </div>
      <div>{type}</div>
    </div>
  );
};

export default UserSearchItem;
