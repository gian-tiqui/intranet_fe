import { Dialog } from "primereact/dialog";
import React from "react";
import useUserProfileStore from "../store/userProfileStore";
import useUserIdStore from "../store/userIdStore";
import { useQuery } from "@tanstack/react-query";
import { findUserById } from "../utils/service/userService";

const UserProfileDialog = () => {
  const { userProfileVisible, setUserProfileVisible } = useUserProfileStore();
  const { userId } = useUserIdStore();

  const {
    data: user,
    isError,
    error,
  } = useQuery({
    queryKey: [`user-profile-${userId}`],
    queryFn: () => findUserById(userId),
    enabled: !!userId || userId != undefined,
  });

  if (isError) {
    console.error(error);
  }

  return (
    <Dialog
      header={
        <div className="flex items-center gap-3">
          <p className="text-md">{user?.data.user.firstName}&apos;s Profile</p>
        </div>
      }
      pt={{
        root: { className: "rounded-3xl" },
        header: { className: "bg-[#CBD5E1] rounded-t-3xl" },
        content: { className: "bg-[#CBD5E1] rounded-b-3xl" },
      }}
      className="h-96 w-96"
      visible={userProfileVisible}
      onHide={() => {
        setUserProfileVisible(false);
      }}
    >
      <p>
        {user?.data.user.firstName} {user?.data.user.lastName}
      </p>

      <p>{user?.data.user.employeeLevel.level}</p>
      <p>{user?.data.user.department.departmentName}</p>
      <p>{user?.data.user.department.division.divisionName}</p>
    </Dialog>
  );
};

export default UserProfileDialog;
