import { isQmType } from "@/app/functions/functions";
import { QmType, QmTypeItem } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { Dispatch, SetStateAction } from "react";
import FolderItem from "./FolderItem";

interface Props {
  setSelectedFolder: Dispatch<SetStateAction<QmType | undefined>>;
  data: QmType | QmTypeItem;
}

const Folder: React.FC<Props> = ({ setSelectedFolder, data }) => {
  if (!isQmType(data as QmType))
    return <FolderItem item={data as QmTypeItem} />;

  return (
    <div className="flex flex-col w-full px-3 cursor-default ">
      <div
        onDoubleClick={() => setSelectedFolder(data as QmType)}
        className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-700 px-3"
      >
        <div className="flex items-center gap-3 py-3">
          <Icon icon={data.icon} className="h-7 w-7" />
          <p className="font-semibold text-sm">{data.folderName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <Icon icon={"material-symbols:download"} className="h-6 w-6" />
          </div>
          <div className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800">
            <Icon
              icon={"material-symbols:delete-outline"}
              className="h-6 w-6"
            />{" "}
          </div>
        </div>
      </div>

      <hr className="w-full border-b-0 border-black dark:border-white" />
    </div>
  );
};

export default Folder;
