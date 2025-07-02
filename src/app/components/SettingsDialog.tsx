import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import React, { Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import UserInfo from "./UserInfo";
import Password from "./Password";
import SecretQuestion from "./SecretQuestion";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const SettingsDialog: React.FC<Props> = ({ setVisible, visible }) => {
  const headerTemplate = () => (
    <div className="flex items-center justify-between w-full pr-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Icon icon="mdi:cog" className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account preferences
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog
      pt={{
        header: {
          className:
            "border-b border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-t-2xl px-6 py-5",
        },
        content: {
          className:
            "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-b-2xl p-0 overflow-hidden",
        },
        root: {
          className:
            "rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden",
        },
        mask: {
          className: "backdrop-blur-sm bg-black/20 dark:bg-black/40",
        },
        closeButton: {
          className:
            "w-10 h-10 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-red-200 dark:hover:border-red-800 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-red-500",
        },
      }}
      visible={visible}
      onHide={() => {
        if (visible) {
          setVisible(false);
        }
      }}
      className="w-[95%] max-w-4xl"
      header={headerTemplate()}
      draggable={false}
      resizable={false}
      modal
    >
      <TabView
        pt={{
          panelContainer: {
            className: "bg-transparent border-none p-0",
          },
          nav: {
            className: "bg-transparent border-none px-6 pt-4 pb-0 flex gap-2",
          },
          navContent: {
            className: "bg-transparent border-none p-0 flex gap-2",
          },
          inkbar: {
            className: "hidden",
          },
        }}
      >
        <TabPanel
          header={
            <div className="flex items-center gap-2">
              <Icon icon="mdi:account-circle-outline" className="w-5 h-5" />
              <span>Profile</span>
            </div>
          }
          pt={{
            headerAction: {
              className:
                "bg-gray-100/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl px-4 py-2.5 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium backdrop-blur-sm",
            },
            content: {
              className: "p-6 bg-transparent overflow-auto h-96",
            },
          }}
        >
          <div className="space-y-4">
            <UserInfo />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <div className="flex items-center gap-2">
              <Icon icon="mdi:lock-outline" className="w-5 h-5" />
              <span>Security</span>
            </div>
          }
          pt={{
            headerAction: {
              className:
                "bg-gray-100/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl px-4 py-2.5 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium backdrop-blur-sm",
            },
            content: {
              className: "p-6 bg-transparent overflow-auto h-96",
            },
          }}
        >
          <div className="space-y-4">
            <Password />
          </div>
        </TabPanel>

        <TabPanel
          header={
            <div className="flex items-center gap-2">
              <Icon icon="mdi:shield-key-outline" className="w-5 h-5" />
              <span>Recovery</span>
            </div>
          }
          pt={{
            headerAction: {
              className:
                "bg-gray-100/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl px-4 py-2.5 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium backdrop-blur-sm",
            },
            content: {
              className: "p-6 bg-transparent overflow-auto h-96",
            },
          }}
        >
          <div className="space-y-4">
            <SecretQuestion />
          </div>
        </TabPanel>
      </TabView>
    </Dialog>
  );
};

export default SettingsDialog;
