"use client";
import LocationComp from "@/app/qm-portal/components/LocationComp";
import useSubfolderStore from "@/app/store/subfolderStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect } from "react";
import FolderItem from "./FolderItem";
import { useQuery } from "@tanstack/react-query";
import { getFolderById } from "@/app/functions/functions";
import useSignalStore from "@/app/store/signalStore";

const FMain = () => {
  const { subfolder } = useSubfolderStore();
  const { signal, setSignal } = useSignalStore();

  const { data: subFolder, refetch } = useQuery({
    queryKey: ["subfolder", subfolder?.id],
    queryFn: () => {
      if (!subfolder) {
        return null;
      }
      return getFolderById(subfolder.id);
    },
    enabled: !!subfolder,
  });

  useEffect(() => {
    const refetchSubFolder = () => {
      refetch();
      setSignal(false);
    };

    refetchSubFolder();
  }, [refetch, signal, setSignal]);

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

        <LocationComp name={subfolder?.name} />

        <div className="overflow-auto w-full flex flex-col gap-2">
          {subFolder && subFolder.posts.length > 0 ? (
            subFolder.posts.map((data) => (
              <FolderItem key={data.pid} post={data} />
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

export default FMain;
