import { Dialog } from "primereact/dialog";
import React from "react";
import useUserProfileStore from "../store/userProfileStore";
import useUserIdStore from "../store/userIdStore";

const UserProfileDialog = () => {
  const { userProfileVisible, setUserProfileVisible } = useUserProfileStore();
  const { userId } = useUserIdStore();

  return (
    <Dialog
      pt={{
        header: { className: "bg-[#CBD5E1]" },
        content: { className: "bg-[#CBD5E1]" },
      }}
      visible={userProfileVisible}
      onHide={() => {
        setUserProfileVisible(false);
      }}
    >
      {userId}
    </Dialog>
  );
};

export default UserProfileDialog;
