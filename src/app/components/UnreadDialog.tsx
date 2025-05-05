import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";

interface State {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  message: string;
}

const UnreadDialog: React.FC<State> = ({ setVisible, visible, message }) => {
  return (
    <Dialog
      pt={{
        header: {
          className: "bg-[#CBD5E1]/60 backdrop-blur text-blue-700 font-black",
        },
        content: { className: "bg-[#EEEEEE]/60 pt-6 backdrop-blur" },
      }}
      className="w-96"
      visible={visible}
      header="Looks like you missed something"
      onHide={() => setVisible(false)}
    >
      <p className="text-xl font-medium">{message}</p>
    </Dialog>
  );
};

export default UnreadDialog;
