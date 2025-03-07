import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  deptId: number | undefined;
}

const EditDepartmentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  deptId,
}) => {
  return (
    <Dialog
      header={"Edit department date"}
      className="w-96"
      pt={{
        header: {
          className: "bg-white dark:bg-neutral-950 dark:text-white",
        },
        content: { className: "bg-neutral-200 dark:bg-neutral-950" },
      }}
      visible={visible}
      onHide={() => {
        if (visible) {
          setVisible(false);
        }
      }}
    >
      {deptId}
    </Dialog>
  );
};

export default EditDepartmentDialog;
