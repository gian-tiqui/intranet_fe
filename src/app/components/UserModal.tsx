import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { decodeUserData } from "../functions/functions";

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
  const [lid, setLid] = useState<number | undefined>(undefined);

  useEffect(() => {
    const l = decodeUserData()?.lid;
    if (l) setLid(l);
  }, []);

  const ButtonItem: React.FC<{
    icon: string;
    label: string;
    onClick: (e: React.MouseEvent) => void;
    hiddenOnMobile?: boolean;
    showOnlyOnMobile?: boolean;
  }> = ({ icon, label, onClick, hiddenOnMobile, showOnlyOnMobile }) => {
    const visibility = showOnlyOnMobile
      ? "md:hidden"
      : hiddenOnMobile
      ? "hidden md:flex"
      : "flex";

    return (
      <div
        className={`w-full h-12 cursor-pointer px-4 ${visibility} items-center gap-3 rounded-xl transition-all duration-300 ease-out
          bg-[#EEEEEE] hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 shadow border border-gray-300 dark:border-gray-700`}
        onClick={onClick}
      >
        <Icon icon={icon} className="h-5 w-5 text-blue-500" />
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </p>
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={() => setVisible(false)}
      className="w-[22rem]"
      pt={{
        header: { className: `bg-[#EEEEEE] dark:bg-gray-900 rounded-t-3xl` },
        content: {
          className:
            "bg-[#EEEEEE] dark:bg-gray-900 rounded-b-3xl p-4 space-y-3",
        },
        mask: { className: "backdrop-blur-sm" },
        root: { className: "rounded-3xl shadow-2xl" },
      }}
      header={
        <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          What would you like to do?
        </h3>
      }
    >
      {isAdmin && (
        <ButtonItem
          icon="solar:graph-up-bold-duotone"
          label="View Dashboard"
          onClick={() => {
            router.push("/admin/dashboard");
            setVisible(false);
          }}
        />
      )}

      {showMyPosts && (
        <ButtonItem
          icon="solar:chart-bold-duotone"
          label="Check user read count"
          onClick={() => {
            router.push("/monitoring");
            setVisible(false);
          }}
        />
      )}

      {lid && lid > 1 && (
        <ButtonItem
          icon="solar:user-check-bold-duotone"
          label="Check users to be approved"
          hiddenOnMobile
          onClick={() => {
            router.push("/pending");
            setVisible(false);
          }}
        />
      )}

      <ButtonItem
        icon="solar:settings-bold-duotone"
        label="Update my settings"
        hiddenOnMobile
        onClick={(e) => {
          handleShowSettings(e);
          setVisible(false);
        }}
      />

      <ButtonItem
        icon="solar:settings-bold-duotone"
        label="Update my settings"
        showOnlyOnMobile
        onClick={(e) => {
          handleShowSettingsMobile(e);
          setVisible(false);
        }}
      />

      <ButtonItem
        icon="solar:logout-3-bold-duotone"
        label="Logout the portal"
        onClick={(e) => {
          handleLogout(e);
          setVisible(false);
        }}
      />
    </Dialog>
  );
};

export default UserModal;
