import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React from "react";
import useShowUserModalStore from "../store/showUserModal";

/**
 * Fix the modal not closing when the x button is clicked
 */

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isAdmin: boolean;
  showMyPosts: boolean;
  handleShowSettings: (event: React.MouseEvent) => void;
  handleShowSettingsMobile: (event: React.MouseEvent) => void;
  handleLogout: (event: React.MouseEvent) => Promise<void>;
}

const UserModal: React.FC<Props> = ({
  isAdmin,
  showMyPosts,
  handleLogout,
  handleShowSettings,
  handleShowSettingsMobile,
}) => {
  const router = useRouter();
  const { setUVisible, uVisible } = useShowUserModalStore();

  return (
    <Dialog
      visible={uVisible}
      className="w-96"
      pt={{
        header: {
          className: `bg-[#EEEEEE] rounded-t-3xl`,
        },
        content: {
          className: "bg-[#EEEEEE] pt-2 rounded-b-3xl flex flex-col gap-1",
        },
        root: { className: "rounded-3xl" },
      }}
      onHide={() => {
        setUVisible(false);
      }}
      header="What would you like to do?"
    >
      {isAdmin && (
        <>
          <div
            className="w-full h-12 px-5 flex items-center border border-black"
            onClick={() => router.push("/admin/dashboard")}
          >
            <p>Dashboard</p>
          </div>
        </>
      )}
      {showMyPosts && (
        <div
          className="w-full h-12 px-5 flex items-center border border-black"
          onClick={() => {
            router.push("/monitoring");
          }}
        >
          <p className="text-sm font-medium">Monitoring</p>
        </div>
      )}
      <div
        className="w-full h-12 px-5 flex items-center border border-black"
        onClick={() => {
          router.push("/history");
        }}
      >
        <p className="text-sm font-medium">History</p>
      </div>
      <div
        className="hidden w-full h-12 px-5 md:flex items-center border border-black"
        onClick={handleShowSettings}
      >
        <p className="text-sm font-medium">Settings</p>
      </div>

      <div
        className="w-full h-12 px-5 flex items-center border border-black md:hidden"
        onClick={handleShowSettingsMobile}
      >
        <p className="text-sm font-medium">Settings</p>
      </div>
      <div
        className="w-full h-12 px-5 flex items-center border border-black"
        onClick={handleLogout}
      >
        <p className="text-sm font-medium">Logout</p>
      </div>
    </Dialog>
  );
};

export default UserModal;
