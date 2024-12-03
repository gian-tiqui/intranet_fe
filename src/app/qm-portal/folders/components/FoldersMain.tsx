"use client";
import useFolderStore from "@/app/store/useFolderStore";
import { useRouter } from "next/navigation";
import React from "react";
import Folder from "../../components/Folder";
import { Icon } from "@iconify/react/dist/iconify.js";

const FoldersMain = () => {
  const { selectedFolder, setSelectedFolder } = useFolderStore();
  const router = useRouter();

  if (!selectedFolder) router.back();

  return (
    <div className="h-[90vh]">
      <p className="font-bold mb-5 text-xl">Quality Management Portal</p>
      <div className="p-4 bg-white dark:bg-neutral-900 rounded h-[70vh] overflow-auto">
        <div className="flex items-center justify-between gap-1 mb-4">
          <div className="flex items-center gap-1">
            <p className="text-sm mb-2 font-semibold">Name</p>
            <Icon icon={"fluent:arrow-down-24-filled"} className="-rotate-45" />
          </div>
          <div className="">
            <Icon icon={"hugeicons:folder-add"} className="h-5 w-5" />
          </div>
        </div>
        <div className="overflow-auto w-full flex flex-col">
          {selectedFolder &&
            selectedFolder.folderItems.map((subFolder, index) => (
              <Folder
                key={index}
                data={subFolder}
                setSelectedFolder={setSelectedFolder}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default FoldersMain;
