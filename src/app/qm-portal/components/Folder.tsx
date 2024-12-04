import { isQmType } from "@/app/functions/functions";
import { QmType, QmTypeItem } from "@/app/types/types";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import FolderItem from "./FolderItem";
import { useRouter } from "next/navigation";

interface Props {
  setSelectedFolder: (selectedFolder: QmType) => void;
  data: QmType | QmTypeItem;
}

const Folder: React.FC<Props> = ({ setSelectedFolder, data }) => {
  const router = useRouter();

  const handleDoubleClick = () => {
    setSelectedFolder(data as QmType);

    if (!isQmType(data as QmType)) console.log("meow");
    else router.push(`qm-portal/folders`);
  };

  if (!isQmType(data as QmType))
    return <FolderItem item={data as QmTypeItem} />;

  return (
    <div className="flex flex-col w-full px-3 cursor-default">
      <div
        onDoubleClick={handleDoubleClick}
        className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-700 px-3"
      >
        <div className="flex items-center gap-3 py-3">
          <Icon icon={(data as QmType).icon} className="h-7 w-7" />
          <p className="font-semibold text-sm">{(data as QmType).folderName}</p>
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
