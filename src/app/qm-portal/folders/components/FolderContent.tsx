"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import LocationComp from "../../components/LocationComp";
import useFolderStore from "@/app/store/useFolderStore";
import Folder from "../../components/Folder";

const FolderContent = () => {
  const { selectedFolder } = useFolderStore();

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

        <LocationComp name={selectedFolder?.name} />

        <div className="overflow-auto w-full flex flex-col">
          {selectedFolder && selectedFolder.subfolders.length > 0 ? (
            selectedFolder.subfolders.map((data) => (
              <Folder data={data} key={data.id} />
            ))
          ) : (
            <div className="grid place-content-center w-full h-[55vh]">
              <p className="text-sm">No files</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderContent;
