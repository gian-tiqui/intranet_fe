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
        header: { className: "rounded-t-2xl bg-[#CBD5E1]" },
        content: {
          className: "rounded-b-2xl bg-[#CBD5E1]",
        },
        root: { className: "rounded-2xl" },
      }}
      visible={visible}
      onHide={() => {
        if (visible) {
          setVisible(false);
        }
      }}
      className="h-[65vh] w-[95%] md:w-[35%]"
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
          pt={{
            headerAction: { className: "bg-inherit" },
            content: { className: "grid place-content-center" },
          }}
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
