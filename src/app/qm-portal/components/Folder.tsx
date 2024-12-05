import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { Folder as FolderT } from "@/app/types/types";
import { useRouter } from "next/navigation";

interface Props {
  setSelectedFolder: (selectedFolder: FolderT) => void;
  data: FolderT;
}

const Folder: React.FC<Props> = ({ setSelectedFolder, data }) => {
  const router = useRouter();

  const handleDoubleClick = () => {
    setSelectedFolder(data);

    router.push(`qm-portal/folders/${data.id}`);
  };

  return (
    <div className="flex flex-col w-full px-3 cursor-default">
      <div
        onDoubleClick={handleDoubleClick}
        className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-neutral-700 px-3"
      >
        <div className="flex items-center gap-3 py-3">
          <Icon icon={data.icon} className="h-7 w-7" />
          <p className="font-semibold text-sm">{data.name}</p>
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
