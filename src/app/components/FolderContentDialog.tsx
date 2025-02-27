import { useQuery } from "@tanstack/react-query";
import { Dialog } from "primereact/dialog";
import React, { Dispatch, SetStateAction } from "react";
import { getFolderById } from "../functions/functions";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  folderId: number;
  setFolderId: Dispatch<SetStateAction<number>>;
}

const FolderContentDialog: React.FC<Props> = ({
  visible,
  setVisible,
  folderId,
}) => {
  const { data } = useQuery({
    queryKey: [`folder-${folderId}`],
    queryFn: () => getFolderById(folderId),
    enabled: !!folderId,
  });

  return (
    <Dialog
      visible={visible}
      onHide={() => {
        if (visible) setVisible(false);
      }}
      className="w-[90%] h-[80vh]"
      header={data?.name}
    >
      {JSON.stringify(data?.posts)}
    </Dialog>
  );
};

export default FolderContentDialog;
