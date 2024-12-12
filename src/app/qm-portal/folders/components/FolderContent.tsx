"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import LocationComp from "../../components/LocationComp";
import useFolderStore from "@/app/store/useFolderStore";
import Folder from "../../components/Folder";
import useSubFolderStore from "@/app/store/createSubFolder";
import { useQuery } from "@tanstack/react-query";
import { getFolderById } from "@/app/functions/functions";
import useSignalStore from "@/app/store/signalStore";
import { useRouter } from "next/navigation";

const FolderContent = () => {
  const { selectedFolder } = useFolderStore();
  const { signal, setSignal } = useSignalStore();
  const { setOpenSubFolder } = useSubFolderStore();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["sub-folder", selectedFolder?.id],
    queryFn: () => {
      if (!selectedFolder) {
        return null;
      }
      return getFolderById(selectedFolder.id);
    },
    enabled: !!selectedFolder,
  });

  useEffect(() => {
    const handleRefetchSubFolder = () => {
      refetch();

      setSignal(false);
    };

    handleRefetchSubFolder();
  }, [signal, setSignal, refetch]);

  const [hasWindow, setHasWindow] = useState(false);

  useEffect(() => {
    setHasWindow(typeof window !== "undefined");
  }, []);

  if (!hasWindow) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) router.back();

  return (
    <div className="h-[90vh]">
      <p className="font-bold mb-5 text-xl">Quality Management Portal</p>
      <div className="p-4 bg-white dark:bg-neutral-900 rounded h-[70vh] overflow-auto">
        <div className="flex items-center justify-between gap-1 mb-4">
          <div className="flex items-center gap-1">
            <p className="text-sm mb-2 font-semibold">Name</p>
            <Icon icon={"fluent:arrow-down-24-filled"} className="-rotate-45" />
          </div>
          <div
            onClick={() => setOpenSubFolder(true)}
            className="hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded p-1"
          >
            <Icon icon={"hugeicons:folder-add"} className="h-5 w-5" />
          </div>
        </div>

        <LocationComp name={selectedFolder?.name} />

        <div className="overflow-auto w-full flex flex-col">
          {data && data.subfolders.length > 0 ? (
            data.subfolders.map((data) => <Folder data={data} key={data.id} />)
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
