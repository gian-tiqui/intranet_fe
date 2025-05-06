import { Dialog } from "primereact/dialog";
import React from "react";
import useUserProfileStore from "../store/userProfileStore";
import useUserIdStore from "../store/userIdStore";
import { useQuery } from "@tanstack/react-query";
import { findUserById } from "../utils/service/userService";
import wmcLogo from "../assets/westlake_logo_horizontal.jpg.png";
import { Image } from "primereact/image";
import { PrimeIcons } from "primereact/api";

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
      showHeader={false}
      pt={{
        root: { className: "rounded-3xl" },
        header: { className: "bg-[#CBD5E1]/40 backdrop-blur rounded-t-3xl" },
        content: {
          className: "bg-[#CBD5E1] rounded-lg h-56 w-[400px] flex p-0",
        },
      }}
      onMaskClick={() => {
        if (userProfileVisible) setUserProfileVisible(false);
      }}
      className="w-96"
      visible={userProfileVisible}
      onHide={() => {
        setUserProfileVisible(false);
      }}
    >
      <div className="w-[47%] h-full bg-blue-600 rounded-s-lg flex flex-col items-center justify-center gap-3 relative">
        <div className="h-3 w-3 absolute top-3 left-3 bg-[#EEEEEE] rounded-full"></div>
        <div className="h-3 w-3 absolute bottom-3 left-3 bg-[#EEEEEE] rounded-full"></div>
        <div className="h-3 w-3 absolute top-3 right-3 bg-[#EEEEEE] rounded-full"></div>
        <div className="h-3 w-3 absolute bottom-3 right-3 bg-[#EEEEEE] rounded-full"></div>
        <Image src={wmcLogo.src} alt="WMC" className="h-12 w-12 shadow" />
        <p className="text-xs text-[#EEEEEE] font-semibold text-center">
          Westlake Medical Center
        </p>
      </div>
      <div className="w-[58%] p-4 text-blue-600 text-sm font-medium gap-2">
        <div className="flex flex-col justify-center h-full gap-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 grid place-content-center rounded-lg">
              <i className={`${PrimeIcons.USER} text-white`}></i>
            </div>
            <p>
              {user?.data.user.firstName.slice(0, 1).toLocaleUpperCase()}
              {user?.data.user.firstName.slice(
                1,
                user?.data.user.firstName.length
              )}{" "}
              {user?.data.user.lastName.slice(0, 1).toLocaleUpperCase()}
              {user?.data.user.lastName.slice(
                1,
                user?.data.user.lastName.length
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 grid place-content-center rounded-lg">
              <i className={`${PrimeIcons.ID_CARD} text-white`}></i>
            </div>

            <p> {user?.data.user.employeeLevel.level}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 grid place-content-center rounded-lg">
              <i className={`${PrimeIcons.BUILDING} text-white`}></i>
            </div>

            <p> {user?.data.user.department.departmentName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 grid place-content-center rounded-lg">
              <i className={`${PrimeIcons.HOME} text-white`}></i>
            </div>

            <p> {user?.data.user.department.division.divisionName}</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UserProfileDialog;
