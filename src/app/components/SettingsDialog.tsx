import { Dialog } from "primereact/dialog";
import { TabPanel, TabView } from "primereact/tabview";
import React, { Dispatch, SetStateAction } from "react";
import UserInfo from "./UserInfo";
import Password from "./Password";
import SecretQuestion from "./SecretQuestion";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const SettingsDialog: React.FC<Props> = ({ setVisible, visible }) => {
  return (
    <Dialog
      pt={{
        header: { className: "dark:bg-neutral-950 dark:text-white" },
        content: {
          className: "bg-neutral-100 dark:bg-neutral-900 dark:text-white",
        },
      }}
      visible={visible}
      onHide={() => {
        if (visible) {
          setVisible(false);
        }
      }}
      className="h-[85vh] w-[95%] md:w-[35%]"
      header={"Settings"}
    >
      <TabView
        className="mt-5"
        pt={{
          panelContainer: { className: "bg-inherit" },
          nav: { className: "bg-inherit" },
        }}
      >
        <TabPanel
          header="User Profile"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          <UserInfo />
        </TabPanel>
        <TabPanel
          header="Password"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          <Password />
        </TabPanel>
        <TabPanel
          header="Secret Question"
          pt={{ headerAction: { className: "bg-inherit" } }}
        >
          <SecretQuestion />{" "}
        </TabPanel>
      </TabView>
    </Dialog>
  );
};

export default SettingsDialog;
