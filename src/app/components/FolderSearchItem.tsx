import React from "react";
import { Folder } from "../types/types";
import { PrimeIcons } from "primereact/api";
import useFolderDialogVisibleStore from "../store/folderDialog";
import folderIdStore from "../store/folderId";

interface Props {
  folder: Folder;
  handleClose: () => void;
  type: string;
}

const FolderSearchItem: React.FC<Props> = ({ folder, handleClose, type }) => {
  const { setFolderDialogVisible } = useFolderDialogVisibleStore();
  const { setFolderId } = folderIdStore();

  const handleClick = () => {
    if (folder) {
      setFolderId(folder.id);
      setFolderDialogVisible(true);
      handleClose();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="h-16 cursor-pointer w-[43%] flex items-center justify-between px-5 border border-black"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-blue-600 rounded-full grid place-content-center">
          <i className={`${PrimeIcons.FOLDER} text-xl text-white`}></i>
        </div>

        <p className="font-semibold">{folder.name}</p>
      </div>
      <div>{type}</div>
    </div>
  );
};

export default FolderSearchItem;
