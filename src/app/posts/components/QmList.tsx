"use client";
import MotionTemplate from "@/app/components/animation/MotionTemplate";
import { fetchMainFolders } from "@/app/functions/functions";
import useSignalStore from "@/app/store/signalStore";
import { Folder } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import SubfolderItems from "./SubfolderItems";

const QmList = () => {
  const {
    data: folders,
    error,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["main-folder"],
    queryFn: fetchMainFolders,
  });

  const [selectedSubFolder, setSelectedSubFolder] = useState<Folder>();

  const { signal, setSignal } = useSignalStore();

  useEffect(() => {
    const resetList = () => {
      refetch();

      setSignal(false);
    };

    resetList();
  }, [signal, setSignal, refetch]);

  useEffect(() => {
    if (folders) setSelectedSubFolder(folders[0]);
  }, [folders]);

  if (isError) console.error(error);

  if (isLoading) return <p>Loading...</p>;

  return (
    <MotionTemplate>
      <div className="mx-6">
        <div className="flex gap-2 flex-wrap">
          {folders?.map((folder) => (
            <p
              className="bg-inherit cursor-pointer py-1 px-3 text-xs font-semibold border rounded"
              key={folder.id}
              onClick={() => setSelectedSubFolder(folder)}
            >
              {folder.name.split(" ").length > 1
                ? folder.name.split(" ")[0].charAt(0).toUpperCase() +
                  folder.name.split(" ")[1].charAt(0).toUpperCase()
                : folder.name}
            </p>
          ))}
        </div>
        <div className="px-2 pt-5 flex flex-col gap-2">
          {selectedSubFolder?.subfolders.map((subFolder) => (
            <SubfolderItems subfolder={subFolder} key={subFolder.id} />
          ))}
        </div>
      </div>
    </MotionTemplate>
  );
};

export default QmList;
