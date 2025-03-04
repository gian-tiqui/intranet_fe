import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const AddDepartmentDialog: React.FC<Props> = ({ visible, setVisible }) => {
  return (
    <Dialog
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
    ></Dialog>
  );
};

export default AddDepartmentDialog;
