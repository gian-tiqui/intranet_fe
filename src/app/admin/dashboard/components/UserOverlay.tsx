import { User } from "@/app/types/types";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { Dispatch, SetStateAction, useRef } from "react";

interface Props {
  rowData: User;
  setSelectedEmployeeId: Dispatch<SetStateAction<string>>;
  setDeactivateUserVisible: Dispatch<SetStateAction<boolean>>;
  accept: () => void;
  setSelectedUserId: Dispatch<SetStateAction<number | undefined>>;
  setEditUserVisible: Dispatch<SetStateAction<boolean>>;
}

const UserOverlay: React.FC<Props> = ({
  rowData,
  setDeactivateUserVisible,
  setSelectedEmployeeId,
  accept,
  setSelectedUserId,
  setEditUserVisible,
}) => {
  const overlayPanelRef = useRef<OverlayPanel>(null);

  return (
    <>
      <OverlayPanel
        ref={overlayPanelRef}
        className="dark:bg-neutral-900 dark:text-white"
      >
        <div className="flex flex-col gap-2">
          <Button
            icon={`${PrimeIcons.USER_EDIT} me-2`}
            onClick={() => {
              setSelectedUserId(rowData.id);
              setEditUserVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            icon={`${PrimeIcons.USER_MINUS} me-2`}
            onClick={() => {
              setSelectedEmployeeId(rowData.employeeId);
              setDeactivateUserVisible(true);
            }}
          >
            Deactivate
          </Button>
          <Button
            icon={`${PrimeIcons.TRASH} me-2`}
            onClick={() => {
              setSelectedUserId(rowData.id);
              confirmDialog({
                header: "Delete this user?",
                accept,
              });
            }}
          >
            Delete
          </Button>
        </div>
      </OverlayPanel>
      <Button
        icon={`${PrimeIcons.COG}`}
        className="rounded-full"
        onClick={(e) => {
          setSelectedUserId(rowData.id);
          setSelectedEmployeeId(rowData.employeeId);
          overlayPanelRef.current?.toggle(e);
        }}
      ></Button>
    </>
  );
};

export default UserOverlay;
