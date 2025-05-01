import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
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
  visible,
  setVisible,
}) => {
  const router = useRouter();

  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
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
      header={`What would you like to do? `}
    >
      {isAdmin && (
        <>
          <div
            className="w-full h-12 cursor-pointer px-5 flex items-center border border-black hover:bg-gray-200"
            onClick={() => router.push("/admin/dashboard")}
          >
            <p>View Dashboard</p>
          </div>
        </>
      )}
      {showMyPosts && (
        <div
          className="w-full h-12 cursor-pointer px-5 flex items-center border border-black hover:bg-gray-200"
          onClick={() => {
            router.push("/monitoring");
          }}
        >
          <p className="text-sm font-medium">Check user read count</p>
        </div>
      )}

      <div
        className="hidden w-full h-12 cursor-pointer px-5 md:flex items-center border border-black hover:bg-gray-200"
        onClick={handleShowSettings}
      >
        <p className="text-sm font-medium">Update my settings</p>
      </div>

      <div
        className="w-full h-12 cursor-pointer px-5 flex items-center border border-black md:hidden hover:bg-gray-200"
        onClick={handleShowSettingsMobile}
      >
        <p className="text-sm font-medium">Update my settings</p>
      </div>
      <div
        className="w-full h-12 cursor-pointer px-5 flex items-center border border-black hover:bg-gray-200"
        onClick={handleLogout}
      >
        <p className="text-sm font-medium">Logout the portal</p>
      </div>
    </Dialog>
  );
};

export default UserModal;
